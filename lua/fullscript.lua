-- Load Infinite Yield (optional)
loadstring(game:HttpGet('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'))()

-- Rename hashed remotes
local router
for i, v in next, getgc(true) do
    if type(v) == 'table' and rawget(v, 'get_remote_from_cache') then
        router = v
        break
    end
end

local function rename(remotename, hashedremote)
    hashedremote.Name = remotename
end
for name, remote in pairs(debug.getupvalue(router.get_remote_from_cache, 1)) do
    rename(name, remote)
end

-- Services
local HttpService = game:GetService("HttpService")
local TextChatService = game:GetService("TextChatService")
local chatChannel = TextChatService.TextChannels.RBXGeneral
local remoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("DataAPI/DataChanged")



local UI = require(game.ReplicatedStorage:WaitForChild("Fsys")).load("UIManager")
_G.inTrade = false

local function traderLoop()
    while not _G.inTrade do
        local text = game:GetService("Players").LocalPlayer
            .PlayerGui.DialogApp.Dialog.NormalDialog.Info.TextLabel.Text
        UI.set_app_visibility("DialogApp", false)
    
        if text ~= "Slippery Slope is starting soon! Teleport there now?" or 
           text ~= "Would you like to teleport to Nursery?" then
    
            local firstWord = text:match("%w+")
            local targetPlayer
    
            local success, result = pcall(function()
                return game:GetService("Players"):WaitForChild(firstWord, 2)
            end)
    
            if success and result then
                targetPlayer = result
                local args = {
                    [1] = targetPlayer,
                    [2] = true
                }
    
                game:GetService("ReplicatedStorage"):WaitForChild("API")
                    :WaitForChild("TradeAPI/AcceptOrDeclineTradeRequest")
                    :InvokeServer(unpack(args))
            else
                warn("[TradeRequest] Failed to find player:", firstWord, "| Error:", result)
            end
        end
    
        task.wait(2)
    end
end




-- Flags
local hasAnnounced = false
local hasProcessedTrade = false
local hasWithdrawn = false
local currentTradePartner = nil
local petLookup = {}

-- 🔁 Reset everything when trade session ends
remoteEvent.OnClientEvent:Connect(function(_, eventType)
    if eventType == "in_active_trade" then
        _G.inTrade = false
        traderLoop()
        hasProcessedTrade = false
        hasWithdrawn = false
        hasAnnounced = false
        currentTradePartner = nil
    end
end)

-- 🛠 Lookup building
local function refreshPetLookup()
    local ClientData = require(game:GetService("ReplicatedStorage").ClientModules.Core.ClientData)
    local rootData = ClientData.get_data()[game.Players.LocalPlayer.Name].inventory.pets

    petLookup = {}
    for _, group in pairs(rootData) do
        for _, pet in pairs(group) do
            local kind = group.kind or "unknown"
            local props = group.properties or {}
            local unique = group.unique

            local flyable = props.flyable or false
            local rideable = props.rideable or false
            local neon = props.neon or false
            local mega = props.mega_neon or false

            local petType = "normal"
            if mega then petType = "mega"
            elseif neon then petType = "neon" end

            if flyable and rideable then
                petType = petType .. "_flyride"
            elseif flyable then
                petType = petType .. "_fly"
            elseif rideable then
                petType = petType .. "_ride"
            end

            local key = kind .. "_" .. petType
            if not petLookup[key] then
                petLookup[key] = unique
            end
        end
    end
end

local function getUniqueByKindAndType(kind, petType)
    local key = kind .. "_" .. petType
    return petLookup[key]
end

-- 🌐 API calls
local function fetchPetsToWithdraw(username)
    local res = http_request({
        Url = "http://47.129.34.40/api/robloxapi/withdraw",
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = HttpService:JSONEncode({
            roblox_username = username
        })
    })

    if res and res.Body then
        return HttpService:JSONDecode(res.Body)
    end
    return nil
end

local function sendPetsToAPI(username, pets)
    local res = http_request({
        Url = "http://47.129.34.40/api/robloxapi",
        Method = "POST",
        Headers = {
            ["Accept"] = "application/json",
            ["Content-Type"] = "application/json",
            ["User-Agent"] = "RobloxScript"
        },
        Body = HttpService:JSONEncode({
            roblox_username = username,
            pet_data = pets
        })
    })

    print("[DEPOSIT] Sent to API. StatusCode:", res.StatusCode)
    _G.inTrade = false
    traderLoop()
end

local function notifySuccessWithdraw(username, pets)
    local res = http_request({
        Url = "http://47.129.34.40/api/robloxapi/success_withdraw",
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = HttpService:JSONEncode({
            roblox_username = username,
            pet_data = pets
        })
    })

    print("[WITHDRAW ✅] Notified success. StatusCode:", res.StatusCode)
end

-- 🚨 Trade Event Handler
remoteEvent.OnClientEvent:Connect(function(_, eventType, tradeTable)
    if eventType ~= "trade" then return end
    if not tradeTable or not tradeTable.sender_offer then return end
    _G.inTrade = true
    local senderName = tradeTable.sender_offer.player_name or "Unknown"

    -- 📣 Chat announce once per trade session
    if not hasAnnounced or currentTradePartner ~= senderName then
        chatChannel:SendAsync("Trading with " .. senderName)
        hasAnnounced = true
        currentTradePartner = senderName
    end

    -- 🐾 Handle Withdraw right away (before confirmation)
    if not hasWithdrawn then
        refreshPetLookup()
        local withdrawData = fetchPetsToWithdraw(senderName)
        local successfulWithdraws = {}

        if withdrawData and withdrawData.pets_to_withdraw and #withdrawData.pets_to_withdraw > 0 then
            for _, pet in ipairs(withdrawData.pets_to_withdraw) do
                local kind = pet.name
                local petType = pet.type
                local unique = getUniqueByKindAndType(kind, petType)

                if unique then
                    game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("TradeAPI/AddItemToOffer"):FireServer(unique)
                    print("[WITHDRAW] Sent:", kind, petType, unique)
                    table.insert(successfulWithdraws, { name = kind, type = petType })
                else
                    print("[WITHDRAW] No match for:", kind, petType)
                end
            end

            if #successfulWithdraws > 0 then
                notifySuccessWithdraw(senderName, successfulWithdraws)
            end
        else
            print("[WITHDRAW] No pets to withdraw.")
        end

        hasWithdrawn = true
    end

    if tradeTable.sender_offer.negotiated then
        game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("TradeAPI/AcceptNegotiation"):FireServer()
        game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("TradeAPI/ConfirmTrade"):FireServer()
    end

    -- ✅ Confirm deposit only once
    if hasProcessedTrade then return end
    if not tradeTable.sender_offer.confirmed then return end

    hasProcessedTrade = true

    -- 📦 Deposit Handler
    local depositData = {
        roblox_username = senderName,
        pet_data = {}
    }

    for _, item in pairs(tradeTable.sender_offer.items or {}) do
        local props = item.properties or {}

        local prefix = "normal"
        if props.mega_neon then prefix = "mega"
        elseif props.neon then prefix = "neon" end

        local suffix = ""
        if props.flyable and props.rideable then
            suffix = "flyride"
        elseif props.flyable then
            suffix = "fly"
        elseif props.rideable then
            suffix = "ride"
        end

        local petType = suffix ~= "" and (prefix .. "_" .. suffix) or prefix

        table.insert(depositData.pet_data, {
            name = item.kind or "Unknown",
            type = petType
        })
    end

    if tradeTable.recipient_offer and #depositData.pet_data > 0 then
        sendPetsToAPI(senderName, depositData.pet_data)
    end

    -- ♻️ Auto-reset for next trade session
    task.delay(3, function()
        _G.inTrade = false
        traderLoop()
        hasProcessedTrade = false
        hasWithdrawn = false
        hasAnnounced = false
        currentTradePartner = nil
    end)
end)


task.spawn(traderLoop)
