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

<div class="container" id="fileManager">


</div>


<script src="http://192.168.2.15/lteplugins/jquery/jquery.min.js"></script>
<script src="http://192.168.2.15/lteplugins/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js"></script>
<script src="http://192.168.2.15/ltedist/js/jquery.form.min.js"></script>
<script src="reFileManagerApi.js"></script>
<script type="text/javascript">

    $(document).ready(function(){
        var url = "http://192.168.2.15/FileManeger/api.php";
        var api = new FileManagerApi(url,"fileManager");
        api.getFileList("/");
    });

</script>

</body>

</html>