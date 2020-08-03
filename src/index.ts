import './index.css';
/**
 * media-selector v.1.0.8
 * 
 * media-selector is a simple library to import medias as the most secure way as possible.
 * 
 * @author Lucas Estrade 
 * @github author => https://github.com/lucasestrade
 * @github repository => https://github.com/lucasestrade/media-selector
 * 
 * Copyright 2020, Lucas Estrade
 * Released under the MIT license
 * 
 */
function MediaSelector(options: Object, callback: Function): void {
    /**
     * providers
     */
    let providers = {
        formats : [
            "AVI",
            "BMP",
            "DOC",
            "DOCX",
            "DLL",
            "XLS",
            "XLSX",
            "EXE",
            "FLV",
            "GIF",
            "GZ",
            "ICO",
            "JPEG",
            "JPG",
            "PNG",
            "MSI",
            "MP3",
            "PPT",
            "PPTX",
            "PDF",
            "RAR",
            "TIFF",
            "TIF",
            "TAR",
            "WMV",
            "WM",
            "ZIP",
            "XML"
        ]
    }

    checkOptions(options);

    /**
     * display media-selector errors
     * @param {string} text text value
     */
    function error(text: string){
        console.error(`media-selector error => ${text}`);
    }

    interface Options{
        maxSize?: number|undefined
        minSize?: number|undefined
        formats?: string[]
        formatError?: Function|undefined
        minSizeError?: Function|undefined
        maxSizeError?: Function|undefined
    }

    interface SizeStatus{
        isSizeOk?: boolean
        option?: string
    }

    /**
     * media options
     * @param {object} options 
     */
    function checkOptions(options: Object){
        const { formats }: Options = options;

        try{
            if(formats !== undefined){
                formats.map(format => {
                    if(!providers.formats.includes(format.toUpperCase())){
                        error("one or more extensions in formats is invalid");
                    }
                })
            }
        }
        catch(er){
            error(er);
        }
    }

    let inputs = document.getElementsByClassName("media-selector--input-file");
    Array.prototype.map.call(inputs, function(input: HTMLInputElement){
        input.addEventListener("change", function(){
            let file: File|undefined = this.files !== null ? this.files[0] : undefined;
            if(file !== undefined){
                const { maxSize, minSize, formats, formatError, minSizeError, maxSizeError }: Options = options;
                let sizeStatus: Object = {
                    isSizeOk: true
                };
                if(maxSize !== undefined){
                    sizeStatus = {
                        isSizeOk: file.size <= maxSize,
                        option: "maxSize"
                    }
                }
                if(minSize !== undefined){
                    sizeStatus = {
                        isSizeOk: file.size >= minSize,
                        option: "minSize"
                    }
                }
        
                let { isSizeOk, option }: SizeStatus = sizeStatus;
                if(isSizeOk){
                    var base64: string|ArrayBuffer|null = null;
                    let blob: File = file;
                    let fileReaderForBase64: FileReader = new FileReader();
                    let fileReader: FileReader = new FileReader();
                    
                    fileReaderForBase64.addEventListener("load", function(e: ProgressEvent<FileReader>){
                        base64 = e.target !== null ? e.target.result : null;
                        fileReaderEnd();
                    });
                    fileReaderForBase64.readAsDataURL(blob);
        
                    let fileReaderEnd = () => {
                        fileReader.onloadend = function(e: ProgressEvent<FileReader>) {
                            let res: string|ArrayBuffer|null;
                            res = e.target !== null ? e.target.result : null;
                            if(res !== null && typeof res !== "string"){
                                let arr: Uint8Array = (new Uint8Array(res)).subarray(0, 4);
                                let header: string = "";
                                for(let i: number = 0; i < arr.length; i++) {
                                    header += arr[i].toString(16);
                                }

                                let mime: string|null = null;
                                let extension: string|null = null; 
                                switch (header.toUpperCase()) {
                                    case "52494646":
                                        mime = "video/x-msvideo";
                                        extension = "avi";
                                        break;
                                    case "424D":
                                        mime = "image/bmp";
                                        extension = "bmp";
                                        break;
                                    case "D0CF11E0A1B11AE1":
                                    case "0D444F43":
                                    case "CF11E0A1B11AE100":
                                    case "DBA52D00":
                                    case "ECA5C100":
                                        mime = "application/msword";
                                        extension = "doc";
                                        break;
                                    case "504B0304":
                                    case "504B030414000600":
                                        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                        extension = "docx";
                                        break;
                                    case "4D5A":
                                        mime = "application/vnd.microsoft.portable-executable";
                                        extension = "dll";
                                        break;
                                    case "D0CF11E0A1B11AE1":
                                    case "0908100000060500":
                                    case "FDFFFFFF10":
                                    case "FDFFFFFF1F":
                                    case "FDFFFFFF22":
                                    case "FDFFFFFF23":
                                    case "FDFFFFFF28":
                                    case "FDFFFFFF29":
                                        mime = "application/vnd.ms-excel";
                                        extension = "xls";
                                        break;
                                    case "504B0304":
                                    case "504B030414000600":
                                        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                        extension = "xlsx";
                                        break;
                                    case "4D5A":
                                        mime = "application/octet-stream";
                                        extension = "exe";
                                        break;   
                                    case "464C5601":
                                        mime = "video/x-flv";
                                        extension = "flv";
                                        break;
                                    case "47494638":
                                        mime = "image/gif";
                                        extension = "gif";
                                        break;
                                    case "1F8B08":
                                        mime = "application/gzip";
                                        extension = "gz";
                                        break;
                                    case "00000100":
                                        mime = "image/x-icon";
                                        extension = "ico";
                                        break;    
                                    case "FFD8FFE0":
                                    case "FFD8FFE1":
                                    case "FFD8FFE2":
                                    case "FFD8FFE3":
                                        mime = "image/jpeg";
                                        extension = "jpeg";
                                        break;     
                                    case "89504E470D0A1A0A":
                                        mime = "image/png";
                                        extension = "png";
                                        break;    
                                    case "D0CF11E0A1B11AE1":
                                        mime = "application/octet-stream";
                                        extension = "msi";
                                        break; 
                                    case "494433":
                                        mime = "audio/mpeg";
                                        extension = "mp3";
                                        break;
                                    case "D0CF11E0A1B11AE1":
                                    case "006E1EF0":
                                    case "0F00E803":
                                    case "A0461DF0":
                                    case "FDFFFFFF0E000000":
                                    case "FDFFFFFF1C000000":
                                    case "FDFFFFFF43000000":
                                        mime = "application/vnd.ms-powerpoint";
                                        extension = "ppt";
                                        break;
                                    case "504B0304":
                                    case "504B030414000600":
                                        mime = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                                        extension = "pptx";
                                        break;
                                    case "25504446":
                                        mime = "application/pdf";
                                        extension = "pdf";
                                        break;
                                    case "526172211A0700":
                                        mime = "application/x-rar-compressed";
                                        extension = "rar";
                                        break;
                                    case "492049":
                                    case "49492A00":
                                    case "4D4D002A":
                                    case "4D4D002B":
                                        mime = "image/tiff";
                                        extension = "tiff";
                                        break;
                                    case "7573746172":
                                        mime = "application/x-tar";
                                        extension = "tar";
                                        break;
                                    case "3026B2758E66CF11":
                                        mime = "video/x-ms-wmv";
                                        extension = "wmv";
                                        break;
                                    case "504B0304":
                                    case "504B4C495445":
                                    case "504B537058":
                                    case "504B0506":
                                    case "504B0708":
                                    case "57696E5A6970":
                                    case "504B030414000100":
                                        mime = "application/zip";
                                        extension = "zip";
                                        break;
                                    case "3C3F786D6C2076657273696F6E3D22312E30223F3E":
                                        mime = "application/xml";
                                        extension = "xml";
                                        break;
                                    default:
                                        mime = "invalid";
                                        extension = "invalid";
                                        break;
                                }

                                if(mime !== "invalid"){
                                    if(formats !== undefined){
                                        if(!formats.map(v => v.toLowerCase()).includes(extension)){
                                            if(formatError !== undefined){
                                                formatError();
                                                return;
                                            }
                                        }
                                    }

                                    callback({
                                        base64: base64,
                                        mime: mime,
                                        extension: extension
                                    });
                                }else{
                                    if(formatError !== undefined){
                                        formatError();
                                        return;
                                    }
                                }
                            }
                        };
                    }
                    fileReader.readAsArrayBuffer(blob);
                }else{
                    switch(option){
                        case "maxSize":
                            if(maxSizeError !== undefined){
                                maxSizeError();
                            }
                            break;
                        case "minSize":
                            if(minSizeError !== undefined){
                                minSizeError();
                            }
                            break;
                    }
                }
            }
        });
    })
}

export default MediaSelector;