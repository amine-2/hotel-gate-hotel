!macro customInstall

  ; Read updater token
  FileOpen $0 "$INSTDIR\resources\updater-token.txt" r
  FileRead $0 $1
  FileClose $0

  ; Set machine-level GH_TOKEN
  SetRegView 64

  WriteRegStr HKLM \
    "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" \
    "GH_TOKEN_HOTEL" \
    "$1"

  ; Notify Windows
  System::Call 'user32::SendMessageTimeout(i 0xffff, i ${WM_SETTINGCHANGE}, i 0, t "Environment", i 0x2, i 5000, *i .r0)'

  ; Delete token file
  Delete "$INSTDIR\resources\updater-token.txt"

!macroend