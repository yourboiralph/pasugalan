loadstring(game:HttpGet('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'))()

local HttpService = game:GetService("HttpService")
local router

for i, v in next, getgc(true) do
    if type(v) == 'table' and rawget(v, 'get_remote_from_cache') then
        router = v
    end
end

local function rename(remotename, hashedremote)
    hashedremote.Name = remotename
end

table.foreach(debug.getupvalue(router.get_remote_from_cache, 1), rename)

print("=================================================================================")

local ClientData = require(game:GetService("ReplicatedStorage").ClientModules.Core.ClientData)
local rootData = ClientData.get_data()[game.Players.LocalPlayer.Name].inventory.pets

-- Build lookup table
local petLookup = {}

for x, y in pairs(rootData) do
    for i, j in pairs(y) do
        local kind = y.kind or "unknown"
        local props = y.properties or {}
        local unique = y.unique

        local flyable = props.flyable or false
        local rideable = props.rideable or false
        local neon = props.neon or false
        local mega = props.mega_neon or false

        local petType = "normal"
        if mega then
            petType = "mega"
        elseif neon then
            petType = "neon"
        end

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

-- Function to get unique ID
local function getUniqueByKindAndType(kind, petType)
    local key = kind .. "_" .. petType
    return petLookup[key]
end

-- ✅ Use http_request to fetch pets
local function fetchPetsToWithdraw(username)
    local response = http_request({
        Url = "http://47.129.34.40/api/robloxapi/withdraw",
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = HttpService:JSONEncode({
            roblox_username = username
        })
    })

    if response and response.Body then
        return HttpService:JSONDecode(response.Body)
    else
        warn("Failed to fetch pets.")
        return nil
    end
end

-- 🔁 Do the thing
local username = "bubblegumh"
local data = fetchPetsToWithdraw(username)

if data and data.pets_to_withdraw then
    for _, pet in ipairs(data.pets_to_withdraw) do
        local kind = pet.name
        local petType = pet.type
        local unique = getUniqueByKindAndType(kind, petType)

        print("Pet:", kind)
        print("Type:", petType)
        print("Unique ID:", unique or "NOT FOUND")
        print("---------------------SENT TRADE-----------------------")
        local args = {
            [1] = unique
        }
        
        game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("TradeAPI/AddItemToOffer"):FireServer(unpack(args))
        
    end
else
    warn("No pets to withdraw or failed to get data.")
end
