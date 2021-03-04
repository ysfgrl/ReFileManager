<!DOCTYPE html>
<html lang="tr">
<head>
    <title>ReFileManager</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="http://192.168.2.15/lteplugins/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="http://192.168.2.15/lteplugins/bootstrap-4.6.0-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/main.css">

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

<!-- Modal -->


<script src="http://192.168.2.15/lteplugins/jquery/jquery.min.js"></script>
<script src="http://192.168.2.15/lteplugins/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js"></script>
<script src="http://192.168.2.15/ltedist/js/jquery.form.min.js"></script>
<script src="reFileManagerApi.js"></script>
<script type="text/javascript">

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

    /**
     *
     * @param fileInfo
     *
     * fileInfo =
     * {
     *  id:"",
     *  name:"",
     *  path:"",
     *  size:11,
     *  extension:""
     * }
     */
    function selectedFile(fileInfo) {
        $("#selectedFile").val(fileInfo.path);
    }
</script>

</body>

</html>