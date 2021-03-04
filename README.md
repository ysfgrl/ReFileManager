
# ReFileManager

## About The Project

ReFileManager is written using javascript and php. You can easily delete, upload, download and list files. It can be easily integrated into your project :)


![screenshot](screenshot/Screenshot1.png)

![screenshot](screenshot/Screenshot.png)

## Dependency

<details open="open">
  <summary> Dependency List </summary>
  <ol>
    <li>
      <a href="https://getbootstrap.com/docs/4.0/getting-started/introduction/">Bootstrap</a>
    </li>
    <li>
      <a href="https://jquery.com/download/">Jquery 3.4</a>
    </li>
    <li><a href="https://fontawesome.com/">Font Awesome</a></li>
  </ol>
</details>


## How To Use

* Embedded using
```
<html>
<head>

    <link rel="stylesheet" href="fontawesome-free">
    <link rel="stylesheet" href="bootstrap">
    
    <script src="jquery"></script>
    <script src="bootstrap"></script>
    <script src="jquery.form"></script>
    <script src="reFileManagerApi.js"></script>
    
</head>
<script type="text/javascript">

$(document).ready(function(){

    var language = "tr";
    var contentId = "fileManager";
    var fileManagerRestUrl = "http://yourdomain/api.php";
    var api = new FileManagerApi(fileManagerRestUrl, contentId, language);
    api.getFileList("/");
    
});
    
</script>
<body>
<div id="fileManager">
    
</div>
</body>
</html>
```

* Modal use for Select File
```
<html>
<head>

    <link rel="stylesheet" href="fontawesome-free">
    <link rel="stylesheet" href="bootstrap">
    
    <script src="jquery"></script>
    <script src="bootstrap"></script>
    <script src="jquery.form"></script>
    <script src="reFileManagerApi.js"></script>
    
</head>
<body>

<form>
    <div class="form-row">
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">
                    SelectFile
                </div>
            </div>
            <input type="text" class="form-control" id="selectedFile">
            <div class="input-group-append">
                <input type="button" value="Select File" id="openFileManager">
            </div>
        </div>
    </div>
</form>

<div class="container" id="fileManager">


</div>
<script>
$(document).ready(function(){
    var language = "tr";
    var contentId = "fileManager";
    var fileManagerRestUrl = "http://192.168.2.15/FileManeger/api.php";
    var api = new FileManagerApi(fileManagerRestUrl, contentId, language,false,selectedFile);
    api.getFileList("/");
    $(document).on("click",'[id="openFileManager"]',function (event){
        api.openFileManager(event);
    });

});
function selectedFile(fileInfo) {
    $("#selectedFile").val(fileInfo.path);
}
    
});
    
</script>
</body>
</html>
```


## Authors

1. Yusuf Uğurlu
2. Onur Ağtaş https://github.com/onuragtas