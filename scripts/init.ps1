# 初始化脚本

# 设置允许修改的用户名（替换为您的用户名）
$allowedUser = "YourUsername"
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

if ($currentUser -ne $allowedUser) {
    Write-Output "错误：只有 $allowedUser 可以修改核心目录。"
    exit 1
}

# 设置核心目录为只读
$corePath = "src/core"
$sharedPath = "src/shared"

if (Test-Path $corePath) {
    attrib +R $corePath /s /d
}

if (Test-Path $sharedPath) {
    attrib +R $sharedPath /s /d
}

Write-Output "初始化完成，核心目录已设置为只读。"