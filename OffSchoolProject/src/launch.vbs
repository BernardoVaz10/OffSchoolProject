' Create a Shell object
Set WshShell = CreateObject("WScript.Shell")

' Set working directory to your project folder (update the path)
WshShell.CurrentDirectory = "C:\Users\user\Desktop\ProjectHairdresser"

' Disable auto-opening of the browser from npm start (if applicable)
WshShell.Environment("Process").Item("BROWSER") = "none"

' Adjust PowerShell execution policy (runs hidden)
WshShell.Run "powershell -NoProfile -Command ""Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass""", 0, True

' Start the Node server (npm start) hidden
WshShell.Run "cmd /c npm start", 0, False

' Wait 5 seconds to give the server time to start
WScript.Sleep 5000

' Open the browser to your URL (this opens only one tab)
WshShell.Run "http://localhost:8081", 0, False
