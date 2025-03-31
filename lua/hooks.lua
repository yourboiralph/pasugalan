-- HOOOKS

for _, obj in ipairs(game.ReplicatedStorage:GetDescendants()) do
    if obj:IsA("RemoteEvent") then
        obj.OnClientEvent:Connect(function(...)
            print("[CLIENT] Received RemoteEvent:", obj.Name, "Arguments:", ...)
        end)
    end
end
for _, obj in ipairs(game.ReplicatedStorage:GetDescendants()) do
    if obj:IsA("RemoteEvent") then
        obj.OnServerEvent:Connect(function(player, ...)
            print("[SERVER] RemoteEvent Triggered:", obj.Name, "From:", player.Name, "Arguments:", ...)
        end)
    end
end

-- HOOK AND PRINT TABLES
local remoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("DataAPI/DataChanged")

-- Function to print tables recursively
local function printTable(tbl, indent)
    indent = indent or 0
    for k, v in pairs(tbl) do
        local formatting = string.rep("  ", indent) .. tostring(k) .. ": "
        if type(v) == "table" then
            print(formatting .. "{")
            printTable(v, indent + 1)
            print(string.rep("  ", indent) .. "}")
        else
            print(formatting .. tostring(v))
        end
    end
end

remoteEvent.OnClientEvent:Connect(function(player, eventType, tradeTable)
    print("[CLIENT] Received RemoteEvent: DataAPI/DataChanged")
    print("Player:", player)
    print("Event Type:", eventType)
    
    if type(tradeTable) == "table" then
        print("Trade Table Contents:")
        printTable(tradeTable) -- Print the table recursively
    else
        print("Trade Table is not a table:", tradeTable)
    end
end)

-- NOTES
sender_offer.negotiated = mao ni ang kung nag accept na ang player
sender_offer.items = table mga pets na gi offer



-- TRADE EVENT HOOK
local remoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("DataAPI/DataChanged")

-- Recursive function to print table structure
local function printTable(tbl, indent)
    indent = indent or 0
    for k, v in pairs(tbl) do
        local formatting = string.rep("  ", indent) .. tostring(k) .. ": "
        if type(v) == "table" then
            print(formatting .. "{")
            printTable(v, indent + 1)
            print(string.rep("  ", indent) .. "}")
        else
            print(formatting .. tostring(v))
        end
    end
end

remoteEvent.OnClientEvent:Connect(function(player, eventType, tradeTable)
    if eventType ~= "trade" then return end

    print("[CLIENT] Trade Event Structure:")
    if type(tradeTable) == "table" then
        printTable(tradeTable)
    else
        print("Trade Table is not a table:", tradeTable)
    end
end)


-- PRINT ONLY NECESSARY
local remoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("DataAPI/DataChanged")

remoteEvent.OnClientEvent:Connect(function(player, eventType, tradeTable)
    if eventType ~= "trade" then return end

    print("[CLIENT] Trade Event Hooked")
    print("Player:", player)
    print("Event Type:", eventType)

    if type(tradeTable) == "table" then
        local senderOffer = tradeTable.sender_offer
        local recipientOffer = tradeTable.recipient_offer
        if senderOffer and type(senderOffer) == "table" then
            if senderOffer.confirmed and recipientOffer.confirmed then

                print("Sender Name:", senderOffer.player_name or "Unknown")
                print("Negotiated:", tostring(senderOffer.negotiated))

                for index, item in pairs(senderOffer.items or {}) do
                    print("Item Index:", index)
                    print("Pet Name:", item.kind or "Unknown")

                    local props = item.properties or {}

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

                    local label = prefix .. "_" .. suffix
                    print("Username: ", senderOffer.player_name)
                    print("Pet Type:", label)
                    print("Confirmed: ", senderOffer.confirmed)

                end
            end
        else
            print("No sender_offer found.")
        end
    else
        print("Trade Table is not a table:", tradeTable)
    end
end)
