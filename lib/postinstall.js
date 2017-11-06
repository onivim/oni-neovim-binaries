// @ts-check
'use strict'

const fs = require("fs")
const os = require("os")
const path = require("path")

const extract = require("extract-zip")
const Github = require("github-releases")
const mkdirp = require("mkdirp")
const rimraf = require("rimraf")

const NEOVIM_TAG = "v0.2.0"

const neovimGithub = new Github({ user: "neovim", repo: "neovim", token: process.env["GITHUB_TOKEN"] || null })

const getAssetForPlatform = () => {
    switch (os.platform()) {
        case "win32":
            return "nvim-win32.zip"
        case "darwin":
            return "nvim-macos.tar.gz"
        case "linux":
            return "nvim-linux64.tar.gz"
        default:
            throw "Unrecognized platform"

    }
}

const downloadAsset = (asset, downloadPath) => {

    return new Promise((resolve, reject) => {

        neovimGithub.downloadAsset(asset, (error, stream) => {
            if (error) {
                reject(error)
            }

            const writeStream = fs.createWriteStream(downloadPath)

            stream.pipe(writeStream)
            writeStream.on("close", () => resolve())
        })
    })

}

neovimGithub.getReleases({ tag_name: NEOVIM_TAG }, async (err, releases) => {

    if (err) {
        throw err
    }


    const release = releases[0]

    if (!release) {
        throw new Error("Unable to find release for: " + NEOVIM_TAG)
    }

    const assetName = getAssetForPlatform()
    const asset = release.assets.find((assetInfo) => assetInfo.name === assetName)

    console.log("--Found matching asset")
    console.dir(asset)

    const downloadFolder = path.join(__dirname, "..", "_temp")

    const downloadFilePath = path.join(downloadFolder, assetName)

    mkdirp.sync(downloadFolder)
    
    await downloadAsset(asset, downloadFilePath)
    console.log("--Download complete!")

    const binFolder = path.join(__dirname, "..", "bin")

    mkdirp.sync(binFolder)

    extract(downloadFilePath, { dir: binFolder }, (err) => {

        if (err) {
            throw err
        }
        console.log("--Extraction complete!")
    })
})




