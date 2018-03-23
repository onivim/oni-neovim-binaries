// @ts-check
'use strict'

const fs = require("fs")
const os = require("os")
const path = require("path")

const releaseDownloader = require("oni-release-downloader")

const deleteQtFiles = () => {
    console.log("--Removing unnecessary nvim-qt files")
    const filesToRemove = [
        "nvim-qt.exe",
        "Qt5Core.dll",
        "Qt5Gui.dll",
        "Qt5Network.dll",
        "Qt5Svg.dll",
        "Qt5Widgets.dll",
    ]

    filesToRemove.forEach((f) => {
        const fullPath = path.join(__dirname, "..", "bin", "Neovim", "bin", f)
        console.log("Deleting file: " + fullPath)
        fs.unlinkSync(fullPath)
        console.log("Deletion complete.")
    })

    console.log("--nvim-qt removed successfully")
}

const download = async () => {

    await releaseDownloader.downloadGithubRelease(path.join(__dirname, ".."),  {
        "user": "neovim",
        "repo": "neovim",
        "tag": "v0.2.2",
        "platforms": {
            "win32": {
                "name": "nvim-win32.zip"
            },
            "win64": {
                "name": "nvim-win64.zip"
            },
            "darwin": {
                "name": "nvim-macos.tar.gz"
            }
        }
    })

    console.log("--Neovim binary download complete!")

    if (os.platform() === "win32") {
        deleteQtFiles()
    }
}

download()
