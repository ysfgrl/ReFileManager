<?php

class Api {

    public $response = array();
    public $rootPath = "/";
    function __construct()
    {

        $this->response["result"] = array();
        $this->response["status"] = false;

        try{

            if ($_POST) {
                $this->response["params"] = $_POST;
                if (isset($_POST["endpoint"])) {
                    $method = $_POST["endpoint"];
                    $params = $_POST["params"];
                    $this->$method($params);
                }else if(isset($_POST["params"])){
                    $params = json_decode($_POST["params"],2);
                    $this->response["params2"] = $params;
                    $method = $params["endpoint"];
                    $params = $params["params"];
                    $this->$method($params);
                }
            }else if($_GET and isset($_GET["filepath"])){
                $realPath = $this->rootPath."/".$_GET["filepath"];
                $realPath = str_replace("//","/",$realPath);
                $realPath = str_replace("//","/",$realPath);
                header("Cache-Control: public");
                header("Content-Description: File Transfer");
                header("Content-Disposition: attachment; filename=".$_GET["filepath"]."");
                header("Content-Transfer-Encoding: binary");
                header("Content-Type: binary/octet-stream");
                readfile($realPath);
                exit();
            }
        }catch (Exception $e){
            $this->response["error"] = $e->getMessage();
        }
        echo json_encode($this->response);
    }



    private function login($params)
    {
        $this->response["token"] = "newToken";
    }

    private function getFileList($params){

        $path = $params["path"];
        $path = str_replace("//","/",$path);
        $fileList = $this->scanDir($path);
        $this->response["result"] = array(
            "path" =>$path,
            "fileList" => $fileList
        );
        $this->response["status"] = true;
    }

    private function uploadFile($params){
        $this->response["params3"] = $params;
//        $_FILES['videofile']['type'] == "video/mp4" and
//        $_FILES['videofile']['size'] < 1000000000
        if(isset($_FILES['file']) and
            isset($params["path"])) {
            $realpath =$this->rootPath."/".$params["path"]."/".$_FILES['file']['name'];
            $realpath = str_replace("//","/",$realpath);
            $realpath = str_replace("//","/",$realpath);
            if (move_uploaded_file($_FILES['file']['tmp_name'], $realpath)) {
                $this->response["status"] = true;
                $tempinfo=pathinfo($realpath);
                $tmpfilesize=filesize($realpath);
                $this->response["result"] = array(
                    "id"=>"",
                    "name"=> $tempinfo["basename"],
                    "size"=>$tmpfilesize,
                    "extension"=>$tempinfo["extension"],
                    "path"=> $params["path"]."/".$tempinfo["basename"]
                );
            } else {
                $this->response["status"] = false;
            }

            $this->response["realpath"] = $realpath;
            $this->response["status"] = true;
        }else{
            $this->response["status"] = false;
        }

    }
    private function getParentFileList($params){

        $path = $params["path"];
        $path = str_replace("//","/",$path);
        $path = str_replace("//","/",$path);
        $index = strrpos($path, "/");
        if($index >= 0){
            $newPath = substr($path, 0, $index);
            $fileList = $this->scanDir($newPath);
            $this->response["result"] = array(
                "path" =>$newPath,
                "fileList" => $fileList
            );
            $this->response["status"] = true;
        }else{
            $this->response["status"] = false;
        }

    }

    private function createFolder($params){
        $path = $params["path"];
        $name = $params["name"];
        $realPath = $this->rootPath."/".$path."/".$name;

        $realPath = str_replace("//","/",$realPath);
        $realPath = str_replace("//","/",$realPath);

        if(is_file($realPath) or is_dir($realPath)){
            $this->response["status"] = false;
            $this->response["errorNo"] = 1;
        }else {
            if (mkdir($realPath, 0777, true)) {
                $this->response["status"] = true;
            } else {
                $this->response["status"] = false;
                $this->response["errorNo"] = 2;
            }
        }
    }
    private function createFile($params){
        $path = $params["path"];
        $name = $params["name"];
        $realPath = $this->rootPath."/".$path."/".$name;

        $realPath = str_replace("//","/",$realPath);
        $realPath = str_replace("//","/",$realPath);

        if(is_file($realPath) or is_dir($realPath)){
            $this->response["status"] = false;
            $this->response["errorNo"] = 1;
        }else {
            if (mkdir($realPath, 0777, true)) {
                $this->response["status"] = true;
            } else {
                $this->response["status"] = false;
                $this->response["errorNo"] = 2;
            }
        }
    }
    private function deleteFile($params){
        $path = $params["path"];
        $name = $params["name"];
        $realPath = $this->rootPath."/".$path;

        $realPath = str_replace("//","/",$realPath);
        $realPath = str_replace("//","/",$realPath);

        if(is_file($realPath)){
            if(unlink($realPath)){
                $this->response["status"] = true;
            }else{
                $this->response["status"] = false;
                $this->response["errorNo"] = 1;
            }
        }else if(is_dir($realPath)){
            $file_list = $this->scanDir($params["path"]);
            if(count($file_list) == 0){
                $this->response["status"] = true;
                rmdir($realPath);
            }else {
                $this->response["status"] = false;
                $this->response["errorNo"] = 1;
            }
        }else {
            $this->response["status"] = false;
            $this->response["errorNo"] = 2;
        }

    }

    private function scanDir($folder){
        $file_list = array();
        $realPath = $this->rootPath.$folder;
        $files = scandir($realPath);
        $files = array_diff($files,array("..","."));
        foreach ($files as $key => $value) {
            if(is_file($realPath."/".$value)){
                $tempinfo=pathinfo($realPath."/".$value);
                $tmpfilesize=filesize($realPath."/".$value);
                $file_list[] = array(
                    "id" => $key,
                    "name" => $tempinfo["basename"],
                    "size" => $tmpfilesize,
                    "path" => $folder ."/". $tempinfo["basename"],
                    "extension" => $tempinfo["extension"]
                );
            }else if(is_dir($realPath."/".$value)){
                $file_list[] = array(
                    "id" => $key,
                    "name" => $value,
                    "size" => 0,
                    "path" =>  $folder ."/". $value,
                    "extension" => "folder"
                );
            }
        }
        return $file_list;
    }
}

new Api();