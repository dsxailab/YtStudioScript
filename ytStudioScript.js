// ==UserScript==
// @name         ytStudio
// @namespace    http://tampermonkey.net/
// @version      2025-05-22
// @description  try to take over the world!
// @author       You
// @match        https://studio.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function styleButton(btn) {
        btn.style.zIndex = '9999';
        btn.style.padding = '10px';
        btn.style.backgroundColor = '#28a745';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    }

    function syntheticClick(el) {
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        });
    }

    // Your code here...
    // Create a container div for the toolbar
    const bar = document.createElement('div');
    bar.style.top = '80px';
    bar.style.right = '120px'
    bar.style.position = 'fixed';
    bar.style.background = '#28a74500';
    bar.style.color = 'white';
    bar.style.padding = '10px';
    bar.style.textAlign = 'center';
    bar.style.fontFamily = 'sans-serif';
    bar.style.zIndex = '10000';
    bar.style.display = 'flex';
    bar.style.gap = '10px';

    const pickReuseVidBtn = document.createElement('button');
    pickReuseVidBtn.textContent = 'PickReuseVid';
    styleButton(pickReuseVidBtn);

    const next2endScreen = document.createElement('button');
    next2endScreen.textContent = 'NextToEndScreen';
    styleButton(next2endScreen);

    const vidNameInput = document.createElement('input');

    // Optional: set attributes and styles
    vidNameInput.type = 'text';
    vidNameInput.placeholder = 'video name';
    vidNameInput.style.zIndex = '9999'; // Stay on top
    vidNameInput.style.padding = '5px';
    vidNameInput.style.fontSize = '14px';
    vidNameInput.style.width = '260px';

    vidNameInput.addEventListener('input', () => {
        localStorage.setItem('search_video_input', vidNameInput.value);
    });
    const savedValue = localStorage.getItem('search_video_input');
    if (savedValue) {
        vidNameInput.value = savedValue;
    }

    const lastVidInput = document.createElement('input');

    // Optional: set attributes and styles
    lastVidInput.type = 'text';
    lastVidInput.placeholder = 'last video num';
    lastVidInput.style.zIndex = '9999'; // Stay on top
    lastVidInput.style.padding = '5px';
    lastVidInput.style.fontSize = '14px';
    lastVidInput.style.width = '100px';

    lastVidInput.addEventListener('input', () => {
        localStorage.setItem('lastVidInput', lastVidInput.value);
    });

    const savedLastVidValue = localStorage.getItem('lastVidInput');
    if (savedLastVidValue) {
        lastVidInput.value = savedLastVidValue;
    }

    const labelPublish = document.createElement('label');
    labelPublish.style.display = 'flex';
    labelPublish.style.alignItems = 'center';
    labelPublish.style.gap = '8px';
    labelPublish.style.color = 'black';
    const ckPublish = document.createElement('input');
    ckPublish.type = 'checkbox';
    labelPublish.appendChild(ckPublish);
    labelPublish.appendChild(document.createTextNode('Publish'));
    ckPublish.addEventListener('change', () => {
        localStorage.setItem('ckPublish', ckPublish.checked ? '1' : '0');
    });

    const savedState = localStorage.getItem('ckPublish');
    if (savedState === '1') {
        ckPublish.checked = true;
    }

    const labelAutoThumb = document.createElement('label');
    labelAutoThumb.style.display = 'flex';
    labelAutoThumb.style.alignItems = 'center';
    labelAutoThumb.style.gap = '8px';
    labelAutoThumb.style.color = 'black';
    const ckAutoThumb = document.createElement('input');
    ckAutoThumb.type = 'checkbox';
    labelAutoThumb.appendChild(ckAutoThumb);
    labelAutoThumb.appendChild(document.createTextNode('AutoThumbnail'));
    ckAutoThumb.addEventListener('change', () => {
        localStorage.setItem('ckUploadThumb', ckAutoThumb.checked ? '1' : '0');
    });

    const ckAutoThumbState = localStorage.getItem('ckUploadThumb');
    if (ckAutoThumbState === '1') {
        ckAutoThumb.checked = true;
    }

    function replaceNumberRange(text, newText) {
        // The regular expression `/\d+-\d+/` looks for:
        // \d+: one or more digits
        // -: a hyphen
        // \d+: one or more digits
        // The `g` flag (global) ensures all occurrences are replaced,
        // but in your example 'abc 1-23 def', there's only one.
        return text.replace(/\d+-\d+/, newText);
    }

    function getFileName() {
        return document.getElementById("original-filename").textContent.trim().replace(".mp4", '');
    }

    pickReuseVidBtn.addEventListener('click', async () => {
        document.getElementById('reuse-details-button').click();
        await sleep(1000);
        const searchBox = document.getElementById("search-yours");
        searchBox.value = vidNameInput.value;
        searchBox.dispatchEvent(new InputEvent("input", { bubbles: true }));
        await sleep(2000);

        const card = document.getElementsByClassName("ytcp-entity-card")[0];
        card.click();

        await sleep(1000);
        document.querySelector(".ytcp-uploads-reuse-details-selection-dialog #select-button").click();

        await sleep(1000);
        const textbox = document.getElementById("textbox");
        let text = textbox.textContent;
        const fileName = getFileName();
        text = replaceNumberRange(text, fileName);
        textbox.textContent = text;
        textbox.dispatchEvent(new InputEvent("input", { bubbles: true }));
    });

    next2endScreen.addEventListener('click', async () => {
        const fileName = getFileName();
        const parts = fileName.split('-');
        const lastNumber = parseInt(parts[parts.length - 1], 10);
        const nextNumber = lastNumber + 1;

        document.getElementById("next-button").click();
        await sleep(1000);
        const endScreenBtn = document.getElementById("endscreens-button");
        const alreadySelected = endScreenBtn.innerText == "Edit";
        if (!alreadySelected) {
            endScreenBtn.click();
            await sleep(4000);
            const card = document.querySelector('div.card[aria-label="Import from latest video"]');
            card.click();
            await sleep(500);
            const el = document.getElementsByTagName("ytve-endscreen-editor-preview-overlay-item")[1];
            syntheticClick(el);
            await sleep(2000);

            const isLast = lastNumber === parseInt(lastVidInput.value, 10);
            if (isLast) {
                const radio = document.querySelector("#best-for-viewer");
                if (!radio.checked) {
                    radio.click();
                    await sleep(1000);
                }
            } else {
                const radio = document.querySelector("#choose-video");
                if (!radio.checked) {
                    radio.click();
                    await sleep(1000);
                }

                radio.click();
                await sleep(1000);
                const searchBox = document.getElementById("search-yours");
                let endNum = nextNumber + 50 - 1;
                if (endNum > lastVidInput.value) {
                    endNum = lastVidInput.value;
                }
                searchBox.value = `${nextNumber} ${endNum}`;
                searchBox.dispatchEvent(new InputEvent("input", { bubbles: true }));
                await sleep(2000);
                const nextVidCard = document.getElementsByClassName("ytcp-entity-card")[0];
                nextVidCard.click();
                await sleep(2000);
            }
            document.getElementById("save-button").click();
            await sleep(2000);
        }
        document.getElementById("next-button").click();

        await sleep(2000);
        document.getElementById("next-button").click();
        await sleep(2000);

        if (ckPublish.checked) {
            document.querySelector("tp-yt-paper-radio-button[name='PUBLIC'").click();
        } else {
            document.querySelector("tp-yt-paper-radio-button[name='UNLISTED'").click();
        }

        document.getElementById("done-button").click();
        await sleep(5000);
        document.querySelector("#close-button button").click();
    });

    bar.appendChild(vidNameInput); bar.appendChild(lastVidInput);
    bar.appendChild(pickReuseVidBtn);
    bar.appendChild(next2endScreen);
    bar.appendChild(labelPublish);
    bar.appendChild(labelAutoThumb);

    document.body.insertBefore(bar, document.body.firstChild);

})();