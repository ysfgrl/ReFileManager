/**
 * FileManagerApi
 */
class FileManagerApi{

    static Language = {

        tr:{
            ReTitle: "ReFileManager",
            ReSave: "Kaydet",
            ReUpload: "Yükle",
            ReNewFolder: "Yeni Klasör",
            ReNewFile: "Yeni Dosya",
            ReFileUpload: "Yeni Dosya Yükle",
            ReName: "İsim : ",
            ReSize: "Boyut : ",
            RePath: "Yol : ",
            ReSearch: "Ara",
            ReCurrentPath: "Klasör : ",
            ReSuccessMessage: "İşlem Başarılı ",
            ReErrorMessage: "İşlem Başarılısız ",
            ReIsExistFile: "Bu Dosya veya Klasör Mevcut ",
            ReFileClose: "Kapat",
            ReFileSelect: "Seç"

        },
        en:{
            ReTitle: "ReFileManager",
            ReSave: "Save",
            ReUpload: "Upload",
            ReNewFolder: "New Folder",
            ReNewFile: "New File",
            ReFileUpload: "Upload New File",
            ReName: "Name : ",
            ReSize: "Size : ",
            RePath: "Path : ",
            ReSearch: "Search",
            ReCurrentPath: "Folder : ",
            ReSuccessMessage: "Successful Operation",
            ReErrorMessage: "Operation Failed ",
            ReIsExistFile: "this file or folder exists ",
            ReFileClose: "Close",
            ReFileSelect: "Select"
        },
    }

    locale;
    currentPath = "/";
    isEmbedded;
    currentFileList = [];
    selectedFiles = [];
    contentId = "";
    url = "";
    token = "token";
    template = "";
    modalTemplate = "";
    reFileManagerModal;
    reFileManagerCallBack;


    /**
     * @param {string} url
     * @param {string} contentId
     * @param {string} locale
     * @param {boolean} isEmbedded
     * @param {selectedFile} callback
     */
    constructor(url,contentId,locale, isEmbedded = true, callback = null) {
        this.url = url;
        this.contentId = contentId;
        this.locale = locale;
        this.isEmbedded = false;
        this.reFileManagerCallBack = callback;
        if(isEmbedded){
            this.template = Template.createTemplate();
            $.each(FileManagerApi.Language[this.locale], (key,value) => this.translate(key, value));
            $("#"+contentId).html(this.template);
        }else{
            this.template = Template.createTemplateModal();
            this.modalTemplate = Template.templateModal;
            $.each(FileManagerApi.Language[this.locale], (key,value) => this.translate(key, value));
            $("#"+contentId).html(this.template);
            this.reFileManagerModal = new bootstrap.Modal(document.getElementById('reFileManagerModal'))
            this.reFileManagerModal.hide();
        }
        $("#fileUploadReProgress").parent().hide();
        $(document).on("click",'[id="searchReFile"]', event => this.searchFile(event));
        $(document).on("click",'[id="uploadNewReFile"]', event => this.uploadFile(event));
        $(document).on("click",'[id="selectReFile"]', event => this.selectFile(event));
        $(document).on("click",'[id="openReFile"]', event => this.openFile(event));
        $(document).on("click",'[id="deleteReFile"]', event => this.deleteFile(event));
        $(document).on("click",'[id="editReFile"]',event => this.editFile(event));
        $(document).on("click",'[id="downloadReFile"]',event => this.downloadFile(event));
        $(document).on("click",'[id="createNewReFolder"]',event => this.createFolder(event));
        $(document).on("click",'[id="backReFile"]',event => this.backFile(event));
        $(document).on("click",'[id="refreshReFile"]',event => this.refreshFile(event));
        $(document).on("click",'[id="selectReFileManager"]',event => this.selectFileManager(event))
        $(document).on("click",'[id="closeReFileManager"]',event => this.closeFileManager(event))
    }


    /**
     * @param {string} key
     * @param {string|((substring: string, ...args: any[]) => string)} value
     */
    translate(key, value){
        this.template = this.template.replaceAll("@"+key,value);
    }

    openFileManager(event){
        event.preventDefault();
        this.reFileManagerModal.show();
    }

    closeFileManager(event){
        event.preventDefault();
        this.reFileManagerModal.hide();
    }
    selectFileManager(event){
        event.preventDefault();
        this.reFileManagerModal.hide();
        if(this.reFileManagerCallBack != null){
            if(this.selectedFiles.length > 0){
                var fileInfo = this.findFileById(this.selectedFiles[0]);
                this.reFileManagerCallBack(fileInfo);
            }else{
                this.reFileManagerCallBack(null);
            }
        }
    }
    /**
     * @param {string} type // success, warning, info, error
     * @param {string} title
     * @param {string} body
     * @param {number} delay
     */
    showAlert(type,title,body,delay = 3000){
        var alert = Template.templateAlertItem;
        alert = alert.replaceAll("@AlertType",type);
        var id = Math.floor(Math.random() * (100000));
        alert = alert.replaceAll("@AlertBody",body);
        alert = alert.replaceAll("@AlertId", id+"") ;
        $("#alertContent").html(alert);
        setTimeout(function (id) {
            console.log(id);
            $("#"+id).remove();
        },delay,id);
    }

    backFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        this.getParentFileList(this.currentPath)
    }

    refreshFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        this.getFileList(this.currentPath)
    }

    uploadFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var params =  {"endpoint":"uploadFile","params":{"path":this.currentPath}};
        $("#formUploadParams").val(JSON.stringify(params));
        $(element).parent().parent().parent().parent().attr("action",this.url);
        var form = $(element).parent().parent().parent().parent();

        $(form).ajaxSubmit({
            beforeSubmit : function (formData, formObject, formOptions) {

            },
            beforeSend : function (){
                $("#fileUploadReProgress").css("width","0%");
                $("#fileUploadReProgress").html("0%");
                $("#fileUploadReProgress").parent().show();
            },
            uploadProgress : function (event, position, total, percentComplate) {
                $("#fileUploadReProgress").css("width",percentComplate+"%");
                $("#fileUploadReProgress").html(percentComplate+"%");
            },
            success : function (response){
                $("#fileUploadReProgress").parent().hide();
                var res = JSON.parse(response);
                if(res.status){
                    form.resetForm();
                    $("#refreshReFile").click();
                }
            }
        });
    }
    searchFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var form = $(element).parent();
    }
    createFolder(event){
        event.preventDefault();
        var element = event.currentTarget;
        var form = $(element).parent().parent().parent().parent();
        var formData = {}
        $.each($(form).serializeArray(), function(_, kv) {
            formData[kv.name] = kv.value;
        });
        formData.path = this.currentPath;

        var result = this.ajaxPostSync("createFolder", formData);

        if(result.status){
            this.showAlert("success","Success",FileManagerApi.Language[this.locale].ReSuccessMessage);
            form.resetForm();
            this.getFileList(this.currentPath);
        }else if(result.errorNo == 1){
            this.showAlert("danger","Success",FileManagerApi.Language[this.locale].ReIsExistFile);
        }else if(result.errorNo == 2){
            this.showAlert("danger","Success",FileManagerApi.Language[this.locale].ReErrorMessage);
        }
    }
    deleteFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var fileId=$(element).attr("file-id");
        var fileInfo = this.findFileById(fileId);
        var result = this.ajaxPostSync("deleteFile", fileInfo);
        if(result.status){
            this.showAlert("success","Success",FileManagerApi.Language[this.locale].ReSuccessMessage);
            $(element).parent().parent().parent().parent().parent().remove();
        }else{
            this.showAlert("danger","Success",FileManagerApi.Language[this.locale].ReErrorMessage);
        }
    }
    editFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var fileId=$(element).attr("file-id");
        console.log(fileId);
    }
    openFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var fileId=$(element).attr("file-id");
        var fileInfo = this.findFileById(fileId);
        if (fileInfo.extension === "folder") {
            this.getFileList(fileInfo.path)
        } else {

        }
    }
    downloadFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var fileId=$(element).attr("file-id");
        var fileInfo = this.findFileById(fileId);
        var req = new XMLHttpRequest();
        req.open("GET", this.url+"?filepath="+encodeURI(fileInfo.path), true);
        req.responseType = "blob";
        req.setRequestHeader('my-custom-header', 'custom-value');
        req.onload = function (event) {
            var blob = req.response;
            var fileName = null;
            var contentType = req.getResponseHeader("content-type");

            // IE/EDGE seems not returning some response header
            if (req.getResponseHeader("content-disposition")) {
                var contentDisposition = req.getResponseHeader("content-disposition");
                fileName = contentDisposition.substring(contentDisposition.indexOf("=")+1);
            } else {
                fileName = "unnamed." + contentType.substring(contentType.indexOf("/")+1);
            }

            if (window.navigator.msSaveOrOpenBlob) {
                // Internet Explorer
                window.navigator.msSaveOrOpenBlob(new Blob([blob], {type: contentType}), fileName);
            } else {
                var el = document.getElementById("downloadTarget");
                el.href = window.URL.createObjectURL(blob);
                el.download = fileName;
                el.click();
            }
        };
        req.send();

    }
    selectFile(event){
        event.preventDefault();
        var element = event.currentTarget;
        var fileId=$(element).attr("file-id");

        if(this.selectedFiles.includes(fileId)){
            var parent = $(element).parent().parent().parent().parent();
            parent.removeClass("border-dark")
            parent.removeClass("bg-info");
            parent.addClass("border-success")
            parent.addClass("bg-light")
            var index = this.selectedFiles.indexOf(fileId);
            this.selectedFiles.splice(index,1);
            this.selectedFiles = [];
        }else{
            this.clearSelectFiles();
            var parent = $(element).parent().parent().parent().parent();
            parent.removeClass("border-success")
            parent.removeClass("bg-light")
            parent.addClass("border-dark")
            parent.addClass("bg-info");
            this.setFileInfo(fileId);
            this.selectedFiles.push(fileId);
        }
    }
    clearSelectFiles(){
        this.selectedFiles.forEach((value, index) => {
            var element = $('a[file-id=' + value + ']');
            var parent = $(element).parent().parent().parent().parent();
            parent.removeClass("border-dark")
            parent.removeClass("bg-info");
            parent.addClass("border-success")
            parent.addClass("bg-light")
        });
        this.selectedFiles = [];
    }
    setFileInfo(id){
        var fileInfo = this.findFileById(id);
        var template = Template.templateFileInfo;
        template = template.replaceAll("@CurrentPath",this.currentPath);
        template = template.replaceAll("@Name",fileInfo.name);
        template = template.replaceAll("@Size",fileInfo.size);
        template = template.replaceAll("@Path",fileInfo.path);

        template = template.replaceAll("@ReName", FileManagerApi.Language[this.locale].ReName);
        template = template.replaceAll("@ReSize", FileManagerApi.Language[this.locale].ReSize);
        template = template.replaceAll("@RePath", FileManagerApi.Language[this.locale].RePath);
        template = template.replaceAll("@ReCurrentPath", FileManagerApi.Language[this.locale].ReCurrentPath);

        $("#templateContent").html(template);
    }

    /**
     * @param {string} id
     */
    findFileById(id){
        var fileInfo;
        this.currentFileList.forEach((value, index) => {
           if(id == value.id){
               fileInfo = value;
               return false;
           }
        });
        return fileInfo;
    }

    /**
     *
     */
    refreshFileList(){
        this.selectedFiles = [];
        $("#fileItemContent").html("");
        // var itemTemplateBack = Template.templateBackButton;
        // itemTemplateBack = itemTemplateBack.replaceAll("@ID",-2);
        // itemTemplateBack = itemTemplateBack.replaceAll("@Name","Back")
        // $("#fileItemContent").append(itemTemplateBack);
        //
        // var itemTemplateRefresh = Template.templateBackRefresh;
        // itemTemplateRefresh = itemTemplateRefresh.replaceAll("@ID",-1);
        // itemTemplateRefresh = itemTemplateRefresh.replaceAll("@Name","Refresh")
        // $("#fileItemContent").append(itemTemplateRefresh);

        this.currentFileList.forEach((value, index) => {
            if(value.extension == null){
                var itemTemplate = Template.templateFileItem;
                itemTemplate = itemTemplate.replaceAll("@ID",value.id);
                itemTemplate = itemTemplate.replaceAll("@Name",value.name)
                itemTemplate = itemTemplate.replaceAll("@IconText","");
                itemTemplate = itemTemplate.replaceAll("@IconClass","fa-times text-danger");
                $("#fileItemContent").append(itemTemplate);
            } else if(value.extension == "folder"){

                var itemTemplate = Template.templateFileItem;
                itemTemplate = itemTemplate.replaceAll("@ID",value.id);
                itemTemplate = itemTemplate.replaceAll("@Name",value.name)
                itemTemplate = itemTemplate.replaceAll("@IconText","");
                itemTemplate = itemTemplate.replaceAll("@IconClass","fa-folder h1");
                $("#fileItemContent").append(itemTemplate);
            }else{
                var itemTemplate = Template.templateFileItem;
                itemTemplate = itemTemplate.replaceAll("@ID",value.id);
                itemTemplate = itemTemplate.replaceAll("@Name",value.name)
                if(value.extension.length > 4){
                    itemTemplate = itemTemplate.replaceAll("@IconText",value.extension);
                    itemTemplate = itemTemplate.replaceAll("@IconClass","h3");
                }else{
                    itemTemplate = itemTemplate.replaceAll("@IconText",value.extension);
                    itemTemplate = itemTemplate.replaceAll("@IconClass","h1");
                }

                $("#fileItemContent").append(itemTemplate);
            }

        });
        var template = Template.templateFileInfo;
        template = template.replaceAll("@CurrentPath",this.currentPath);
        template = template.replaceAll("@Name","");
        template = template.replaceAll("@Size","");
        template = template.replaceAll("@Path","");

        template = template.replaceAll("@ReName", FileManagerApi.Language[this.locale].ReName);
        template = template.replaceAll("@ReSize", FileManagerApi.Language[this.locale].ReSize);
        template = template.replaceAll("@RePath", FileManagerApi.Language[this.locale].RePath);
        template = template.replaceAll("@ReCurrentPath", FileManagerApi.Language[this.locale].ReCurrentPath);

        $("#templateContent").html(template);
    }
    getToken(username = "admin" , password= "admin"){

        var result = this.ajaxPostSync("login",{username:username,password:password})
        console.log(result);

    }

    /**
     * @param {string} path
     */
    getFileList(path){
        var result = this.ajaxPostSync("getFileList",{path:path});
        if(result.status){
            this.currentPath = result.result.path;
            this.currentFileList = result.result.fileList;
        }
        console.log(result);
        this.refreshFileList();
    }

    /**
     * @param {string} path
     */
    getParentFileList(path){
        var result = this.ajaxPostSync("getParentFileList",{path:path});
        if(result.status){
            this.currentPath = result.result.path;
            this.currentFileList = result.result.fileList;
        }
        console.log(result);
        this.refreshFileList();
    }

    /**
     * @param {string} endpoint
     * @param {{}|{password: string, username: string}|{path: string}} params
     */
    ajaxPostSync(endpoint, params){
        var result;
        $.ajax(
            {
                url: this.url,
                type: "post",
                async: false,
                dataType: "json",
                data:{
                    endpoint: endpoint,
                    params: params
                },
                success: function(data) {
                    console.log(data);
                    result = data;
                },
                error: function (error) {
                    result = "";
                }
            }
        )
        return result;
    }


}

class Template{

    static createTemplate() {
        var  temp = Template.template.replaceAll("@FileInfoTemplate", Template.templateFileInfo);
        temp = temp.replaceAll("@NavbarTemplate", Template.templatePathInfo);
        temp = temp.replaceAll("@ToolTemplate", Template.templateTool);
        temp = temp.replaceAll("@AlertTemplate", Template.templateAlertContent);
        return temp;
    }

    static createTemplateModal() {
        var  temp = Template.template.replaceAll("@FileInfoTemplate", Template.templateFileInfo);
        temp = temp.replaceAll("@NavbarTemplate", Template.templatePathInfo);
        temp = temp.replaceAll("@ToolTemplate", Template.templateTool);
        temp = temp.replaceAll("@AlertTemplate", Template.templateAlertContent);
        var tempModal = this.templateModal.replaceAll("@ReFileManagerModalContent",temp);
        return tempModal;
    }
    static template =
        `
        <div class="card text-center">
            <div class="card-header py-0">
                @NavbarTemplate
            </div>
            <div class="card-body">
                @ToolTemplate
                
                <div class="row">
                    <div class="col-12">
                        <div class="card" >
                            <div class="card-body">
                                <div class="row" id="fileItemContent">
    
                                </div>
                            </div>
                            <div id="templateContent" class="card-footer p-1">
                                @FileInfoTemplate
                            </div>
                        </div>
                    </div>
                </div>
                @AlertTemplate
            </div>
            <div class="card-footer text-muted p-1">
                Ysfgrl@2021
            </div>
        </div>
        `;

    static templatePathInfo =
        `
            <div class="row py-0">
                <div class="col-12 p-0">
                    <nav class="navbar navbar-expand-lg navbar-light bg-light p-0">
                      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a class="navbar-brand" href="#"><i class="fa h3  text-bold"> @ReTitle </i></a>
                        <ul class="navbar-nav mr-auto mt-2 mt-lg-0"></ul>
                        <form class="form-inline my-2 my-lg-0">
                          <input class="form-control mr-sm-2" type="search" placeholder="@ReSearch" aria-label="Search">
                          <button class="btn btn-outline-secondary my-2 my-sm-0" id="searchReFile" type="submit">@ReSearch</button>
                        </form>
                      </div>
                    </nav>
                </div>
            </div>
        `;


    static templateTool =
        `
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6">
                    <form action="#" method="POST">
                        
                                
                        <div class="form-group my-1">
                           
                            <div class="input-group">
                                <a class="btn btn-primary mr-1" href="#" id="backReFile" ><i class="fas fa-undo "></i></a>
                                <a class="btn btn-primary  mr-1" href="#" id="refreshReFile" ><i class="fas fa-sync"></i></a>
                                <div class="input-group-prepend" >
                                    <span class="input-group-text" >
                                        @ReNewFolder
                                    </span>
                                </div>
                                <input type="text" required name="name" class="form-control" />
                                <div class="input-group-append">
                                    <input class="btn btn-primary" type="submit" id="createNewReFolder" value="@ReSave"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6">
                    <form action="#" method="POST">
                        <div class="form-group mt-1 mb-0">
                            <div class="input-group">
                               
                                <div class="input-group-prepend" >
                                    <span class="input-group-text" >
                                        @ReFileUpload
                                    </span>
                                </div>
                                <input type="file" required name="file" class="form-control" />
                                <input type="hidden" id="formUploadParams" name="params" value="" class="form-control" />
                                <div class="input-group-append">
                                    <input class="btn btn-primary" type="submit" id="uploadNewReFile" value="@ReUpload"/>
                                </div>
                            </div>
                        </div>
                    </form>
                    
                </div>
                <div class="col-sm-12">
                    <div class="progress">
                      <div class="progress-bar progress-bar-striped progress-bar-animated" id="fileUploadReProgress" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
                    </div>
                </div>
                <a href="#" id="downloadTarget"></a>
            </div>
        `;

    static templateFileInfo =
        `
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-left ">
                <span class="badge badge-primary h3">@ReCurrentPath : @CurrentPath</span>
                <span class="badge badge-primary h3">@ReName : @Name</span>
                <span class="badge badge-primary h3">@ReSize : @Size</span>
                <span class="badge badge-primary h3">@RePath : @Path</span>
                </div>
            </div>
        `;
    static templateFileItem =
        `
            <div id="fileItem" file-id="@ID" class="col-xl-2 col-lg-3 col-md-4 col-sm-6  p-1">
                <div class="card border-success mb-2" style="max-width: 18rem;">
                    <div class="card-body p-0">
                        <a href="#" id="openReFile" file-id="@ID"><i class="fa @IconClass">@IconText</i></a>
                        <p class="card-text" >@Name</p>
                    </div>
                    <div class="card-footer bg-transparent border-success p-1">
                        <div class="row">
                            <div class="col-3">
                                <a href="#" id="deleteReFile" file-id="@ID"><i class="fa fa-trash text-dark"></i></a>
                            </div>
                            <div class="col-3">
                                <a href="#" id="editReFile" file-id="@ID"><i class="fa fa-edit text-dark"></i></a>
                            </div>
                            <div class="col-3">
                                <a href="#" id="downloadReFile" file-id="@ID"><i class="fa fa-download text-dark"></i></a>
                            </div>
                            <div class="col-3">
                                <a href="#" id="selectReFile" file-id="@ID"><i class="fa fa-check text-dark"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    static templateAlertContent =
        `
        <div class="row" >
            <div class="col-12" id="alertContent">
                
            </div>
        </div>
        `;
    static templateAlertItem =
        `
            <div class="alert alert-@AlertType" id="@AlertId" role="alert">
              @AlertBody
            </div>
        
        `;

    static templateBackButton =
        `
           <div id="fileItem" file-id="@ID" class="col-xl-2 col-lg-3 col-md-4 col-sm-6  p-1">
                <div class="card border-success mb-2" style="">
                    <div class="card-body p-0 text-center">
                        <a href="#" id="openReFile" file-id="@ID" class="display-3"><i class="fas fa-undo"></i></a>
                        <p class="card-text" >@Name</p>
                    </div>
                </div>
            </div>
        
        `;
    static templateBackRefresh =
        `
           <div id="fileItem" file-id="@ID" class="col-xl-2 col-lg-3 col-md-4 col-sm-6  p-1">
                <div class="card border-success mb-2" style="">
                    <div class="card-body p-0 text-center">
                        <a href="#" id="openReFile" file-id="@ID" class="display-3"><i class="fa fa-sync"></i></a>
                        <p class="card-text" >@Name</p>
                    </div>
                </div>
            </div>
        
        `;
    static templateModal =
        `
        <div class="modal show" id="reFileManagerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-fullscreen-lg-down">
                <div class="modal-content">
                    <div class="modal-body" id="reFileManagerModalBody">
                        @ReFileManagerModalContent
                    </div>
                    <div class="modal-footer">
                        <a type="button" id="closeReFileManager" class="btn btn-secondary">@ReFileClose</a>
                        <a type="button" id="selectReFileManager" class="btn btn-primary">@ReFileSelect</a>
                    </div>
                </div>
            </div>
        </div>
        `;
}

