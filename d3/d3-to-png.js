const inlineStyles = target => {
    const selfCopyCss = elt => {
        const computed = window.getComputedStyle(elt);
        const css = {};
        for (let i = 0; i < computed.length; i++) {
            css[computed[i]] = computed.getPropertyValue(computed[i]);
        }

        for (const key in css) {
            elt.style[key] = css[key];
        }
        return css;
    };

    const root = document.querySelector(target);
    selfCopyCss(root);
    root.querySelectorAll('*').forEach(elt => selfCopyCss(elt));
};

const copyToCanvas = ({target, scale, format, quality}) => {
    const svg = document.querySelector(target);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const svgSize = svg.getBoundingClientRect();

    //Resize can break shadows
    canvas.width = svgSize.width * scale;
    canvas.height = svgSize.height * scale;
    canvas.style.width = svgSize.width;
    canvas.style.height = svgSize.height;

    const ctxt = canvas.getContext('2d');
    ctxt.scale(scale, scale);

    const img = document.createElement('img');
    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData))));
    return new Promise(resolve => {
        img.onload = () => {
            ctxt.drawImage(img, 0, 0);
            const file = canvas.toDataURL(`image/${format}`, (format = 'png'), quality);
            resolve(file);
        };
    });
};

const downloadImage = ({file, name, format}) => {
    const a = document.createElement('a');
    a.download = `${name}.${format}`;
    a.href = file;
    document.body.appendChild(a);
    a.click();
};

async function exportToPng(target, name, {scale = 1, format = 'png', quality = 1, download = true, ignore = null} = {}) {
    const elt = document.querySelector(target);
    //Remember all HTML, as we will modify the styles
    const rememberHTML = elt.innerHTML;

    //Remove unwanted elements
    if (ignore != null) {
        const elt = document.querySelector(ignore);
        elt.parentNode.removeChild(elt);
    }

    //Set all the css styles inline
    // inlineStyles(target, ignore);

    //Copy all html to a new canvas
    return await copyToCanvas({
        target,
        scale,
        format,
        quality
    })
        .then(file => {
            //Download if necessary
            if (download) downloadImage({file, name, format});
            //Undo the changes to inline styles
            // elt.innerHTML = rememberHTML;
            return file;
        })
        .catch(console.error);
}
