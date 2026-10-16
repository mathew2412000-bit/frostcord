/*
 * FrostCord Windows Installer
 * Copyright (c) 2026 FrostCord
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

!define APPNAME "FrostCord"
!define COMPANYNAME "FrostCord"
!define DESCRIPTION "A Discord client mod with advanced features"
!define VERSIONMAJOR 1
!define VERSIONMINOR 29
!define VERSIONBUILD 5
!define HELPURL "https://github.com/mathew2412000-bit/frostcord"
!define UPDATEURL "https://github.com/mathew2412000-bit/frostcord/releases"
!define ABOUTURL "https://github.com/mathew2412000-bit/frostcord"
!define INSTALLSIZE 50000

!define DISCORD_STABLE "$LOCALAPPDATA\Discord"
!define DISCORD_PTB "$LOCALAPPDATA\DiscordPTB"
!define DISCORD_CANARY "$LOCALAPPDATA\DiscordCanary"
!define DISCORD_DEV "$LOCALAPPDATA\DiscordDevelopment"

!define FROSTCORD_DIR "$LOCALAPPDATA\FrostCord"

; Modern UI 2
!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "WinVer.nsh"
!include "nsDialogs.nsh"

; General
Name "${APPNAME}"
OutFile "FrostCordSetup.exe"
Unicode True
RequestExecutionLevel user
InstallDir "${FROSTCORD_DIR}"

; Interface settings
!define MUI_ABORTWARNING
!define MUI_ICON "assets\icon.ico"
!define MUI_UNICON "assets\icon.ico"
!define MUI_BGCOLOR "1A1B1E"
!define MUI_TEXTCOLOR "FFFFFF"

; Custom colors for dark theme
!define DARK_BG "1A1B1E"
!define DARKER_BG "111214"
!define ICE_BLUE "5865F2"
!define ICE_BLUE_HOVER "4752C4"
!define TEXT_WHITE "FFFFFF"
!define TEXT_GRAY "B9BBBE"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE"
Page custom DiscordSelectionPage DiscordSelectionPageLeave
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; Custom welcome page with dark theme
!define MUI_CUSTOMFUNCTION_WELCOMEPRE ShowWelcome

; Installer Sections
Section "FrostCord Core" SecCore
  SectionIn RO

  SetOutPath "$INSTDIR"
  File /r "dist\desktop\*"

  ; Write installation path
  WriteRegStr HKCU "Software\${APPNAME}" "" $INSTDIR

  ; Write uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "QuietUninstallString" "$INSTDIR\Uninstall.exe /S"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "EstimatedSize" ${INSTALLSIZE}
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "HelpLink" "${HELPURL}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLUpdateInfo" "${UPDATEURL}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLInfoAbout" "${ABOUTURL}"

  ; Inject into selected Discord installation
  ${If} $DiscordSelected != ""
    Call InjectFrostCord
  ${EndIf}
SectionEnd

Section "Desktop Shortcut" SecShortcut
  CreateShortcut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\patcher.js" "" "$INSTDIR" "" SW_SHOWNORMAL "" "Open ${APPNAME}"
SectionEnd

Section "Start Menu Shortcut" SecStartMenu
  CreateDirectory "$SMPROGRAMS\${APPNAME}"
  CreateShortcut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\patcher.js" "" "$INSTDIR" "" SW_SHOWNORMAL "" "Open ${APPNAME}"
  CreateShortcut "$SMPROGRAMS\${APPNAME}\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR" "" SW_SHOWNORMAL "" "Uninstall ${APPNAME}"
SectionEnd

; Uninstaller Section
Section "Uninstall"
  ; Restore Discord first
  Call RestoreDiscord

  ; Remove files
  RMDir /r "$INSTDIR"

  ; Remove shortcuts
  Delete "$DESKTOP\${APPNAME}.lnk"
  Delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
  Delete "$SMPROGRAMS\${APPNAME}\Uninstall.lnk"
  RMDir "$SMPROGRAMS\${APPNAME}"

  ; Remove registry keys
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
  DeleteRegKey HKCU "Software\${APPNAME}"
SectionEnd

; Functions
Function .onInit
  StrCpy $DiscordSelected ""
  StrCpy $RestoreDiscord 0

  ; Check if already installed
  ReadRegStr $0 HKCU "Software\${APPNAME}" ""
  ${If} $0 != ""
    MessageBox MB_YESNO "FrostCord is already installed. Would you like to repair it?" IDYES repair
    Abort
    repair:
    StrCpy $INSTDIR $0
  ${EndIf}
FunctionEnd

Function ShowWelcome
  ; Custom dark theme welcome page could be added here
FunctionEnd

Function DiscordSelectionPage
  !insertmacro MUI_HEADER_TEXT "Select Discord Installation" "Choose which Discord version to use with FrostCord"

  nsDialogs::Create 1018
  Pop $0

  ; Set background color
  ${NSD_SetBackgroundColor} $0 "${DARK_BG}"

  ${NSD_CreateLabel} 0u 0u 100% 12u "Select the Discord installation to inject FrostCord into:"
  Pop $1
  SendMessage $1 ${WM_SETTEXT} "" "${APPNAME} Installation"
  SendMessage $1 ${WM_SETFONT} "Arial" 10 700

  ${NSD_CreateRadioButton} 0u 20u 100% 10u "Discord Stable"
  Pop $DiscordStableRB
  ${If} FileExists "${DISCORD_STABLE}"
    SendMessage $DiscordStableRB ${BM_SETCHECK} 1 0
  ${EndIf}

  ${NSD_CreateRadioButton} 0u 35u 100% 10u "Discord PTB"
  Pop $DiscordPTBRB
  ${If} FileExists "${DISCORD_PTB}"
    SendMessage $DiscordPTBRB ${BM_SETCHECK} 1 0
  ${EndIf}

  ${NSD_CreateRadioButton} 0u 50u 100% 10u "Discord Canary"
  Pop $DiscordCanaryRB
  ${If} FileExists "${DISCORD_CANARY}"
    SendMessage $DiscordCanaryRB ${BM_SETCHECK} 1 0
  ${EndIf}

  ${NSD_CreateRadioButton} 0u 65u 100% 10u "Discord Development"
  Pop $DiscordDevRB
  ${If} FileExists "${DISCORD_DEV}"
    SendMessage $DiscordDevRB ${BM_SETCHECK} 1 0
  ${EndIf}

  ${NSD_CreateLabel} 0u 85u 100% 12u "Note: FrostCord will modify the selected Discord installation. Your Discord account and settings will be preserved."
  Pop $2

  nsDialogs::Show
FunctionEnd

Function DiscordSelectionPageLeave
  ${NSD_GetState} $DiscordStableRB $0
  ${If} $0 == 1
    StrCpy $DiscordSelected "${DISCORD_STABLE}"
  ${EndIf}

  ${NSD_GetState} $DiscordPTBRB $0
  ${If} $0 == 1
    StrCpy $DiscordSelected "${DISCORD_PTB}"
  ${EndIf}

  ${NSD_GetState} $DiscordCanaryRB $0
  ${If} $0 == 1
    StrCpy $DiscordSelected "${DISCORD_CANARY}"
  ${EndIf}

  ${NSD_GetState} $DiscordDevRB $0
  ${If} $0 == 1
    StrCpy $DiscordSelected "${DISCORD_DEV}"
  ${EndIf}

  ${If} $DiscordSelected == ""
    MessageBox MB_OK "Please select a Discord installation."
    Abort
  ${EndIf}
FunctionEnd

Function InjectFrostCord
  ; Find the latest app- folder
  Push $0
  Push $1
  Push $2

  StrCpy $0 ""
  StrCpy $1 0

  FindFirst $2 $0 "$DiscordSelected\app-*"
  ${Do}
    ${If} $0 == ""
      ${ExitDo}
    ${EndIf}
    StrCpy $1 $0
    FindNext $2 $0
  ${Loop}
  FindClose $2

  ${If} $1 != ""
    StrCpy $DiscordAppPath "$DiscordSelected\$1\resources"
    Call CopyFrostCordFiles
  ${Else}
    MessageBox MB_OK "Could not find Discord app folder. Please ensure Discord is installed."
    Abort
  ${EndIf}

  Pop $2
  Pop $1
  Pop $0
FunctionEnd

Function CopyFrostCordFiles
  ; Copy FrostCord files to Discord app folder
  DetailPrint "Copying FrostCord files to Discord..."

  CreateDirectory "$DiscordAppPath\app"

  ; Copy all required files
  CopyFiles "$INSTDIR\patcher.js" "$DiscordAppPath\app\patcher.js"
  CopyFiles "$INSTDIR\preload.js" "$DiscordAppPath\app\preload.js"
  CopyFiles "$INSTDIR\renderer.js" "$DiscordAppPath\app\renderer.js"
  CopyFiles "$INSTDIR\renderer.css" "$DiscordAppPath\app\renderer.css"

  ; Copy multi-instance icons if they exist
  ${If} FileExists "$INSTDIR\multi-instance-icons"
    CopyFiles "$INSTDIR\multi-instance-icons\*" "$DiscordAppPath\app\multi-instance-icons"
  ${EndIf}

  ; Create package.json
  FileOpen $0 "$DiscordAppPath\app\package.json" w
  FileWrite $0 '{"name":"discord","main":"index.js"}'
  FileClose $0

  ; Create index.js - uses relative path, no dependency on development folder
  FileOpen $0 "$DiscordAppPath\app\index.js" w
  FileWrite $0 '// FrostCord loader - uses installed files only$\r$\n'
  FileWrite $0 'require("./patcher.js");$\r$\n'
  FileClose $0

  DetailPrint "FrostCord files copied successfully."
FunctionEnd

Function RestoreDiscord
  ; Remove FrostCord injection from all Discord installations
  DetailPrint "Restoring Discord to original state..."

  Push $0
  Push $1
  Push $2

  ; Try all Discord installations
  ${For} $1 1 4
    ${If} $1 == 1
      StrCpy $DiscordSelected "${DISCORD_STABLE}"
    ${ElseIf} $1 == 2
      StrCpy $DiscordSelected "${DISCORD_PTB}"
    ${ElseIf} $1 == 3
      StrCpy $DiscordSelected "${DISCORD_CANARY}"
    ${Else}
      StrCpy $DiscordSelected "${DISCORD_DEV}"
    ${EndIf}

    ${If} FileExists "$DiscordSelected"
      StrCpy $0 ""
      StrCpy $2 0

      FindFirst $2 $0 "$DiscordSelected\app-*"
      ${Do}
        ${If} $0 == ""
          ${ExitDo}
        ${EndIf}
        StrCpy $DiscordAppPath "$DiscordSelected\$0\resources"
        ${If} FileExists "$DiscordAppPath\app"
          RMDir /r "$DiscordAppPath\app"
          DetailPrint "Removed FrostCord from: $DiscordAppPath"
        ${EndIf}
        FindNext $2 $0
      ${Loop}
      FindClose $2
    ${EndIf}
  ${Next}

  Pop $2
  Pop $1
  Pop $0

  DetailPrint "Discord restoration complete."
FunctionEnd

Function un.onInit
  MessageBox MB_YESNO "FrostCord will be uninstalled and Discord will be restored to its original state. Continue?" IDYES continue
  Abort
  continue:
FunctionEnd
