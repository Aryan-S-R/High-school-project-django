$(document).ready(function()
{

    $("#artist").select2();

    $.ajax({
        type : 'GET',
        url : $("#GetArtistDataURL").data('url'),
        success : (data) =>{
            $("#artist").select2({
                data : data['artist_data'],                
                placeholder: "Select Artist",
                allowClear: true,
                templateResult : formatArtistSelect2
            });
            $("#artist").val("").trigger('change')
        },
        error : (err) =>{
            console.log(err);
        }
    });


    function getProductData(){
        $.ajax({
            type : 'GET',
            url : $("#GetProductDataURL").data('url'),
            success : (data) =>{
                console.log("Product Data = ",data);
                productTable(data['product_data']);
            },
            error : (err) =>{
                console.log(err);
            }
        });
    }

    getProductData()


    function formatArtistSelect2(state) {
        if(state.id)
        {
            var container = $(
                '<ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">\
                    <li class="fw-bold"><span style="margin-right:15px"> <img style="height:40px;width:40px;object-fit:cover;border-radius:50%" src="../../media/'+state.img+'" /> </span> '+state.text+'<br>\</li>\
                </ul>'
            )
        }
        return container
    }

    $(".numberInput").click(function()
    {
        $(this).select()
    })

    $(".addNewbtn").click(function()
    {
        $("#addProductForm").trigger("reset");
        $("#ProductId").val("0");
        $(".submitBtn").text("Add");

        $("#artist").val("").trigger('change');

        $("#uploadedSubImagesSection").empty();

        $("#primary_img").attr("src", "../../static/img/no_image.png");
        $("#primary_img_file").attr('required' , 'required');
        $(".submitBtnSection").show();

        $(".productListDTSection").hide();
        $(".addNewBtnSection").hide();

        $(".backBtnSection").show();
        $(".productCreateSection").show();
    });


    $(".backBtn").click(function()
    {
        $(".backBtnSection").hide();
        $(".productCreateSection").hide();

        $(".productListDTSection").show();
        $(".addNewBtnSection").show();
    });

    primary_img_file.onchange = evt => {
        const [file] = primary_img_file.files;
        if (file) {
            primary_img.src = URL.createObjectURL(file)
        }
    }

    $("#sub_img_file").change(function(){
        $("#uploadedSubImagesSection").empty();
        

        var imageFile = [];
        var FileList = $(this).get(0).files;

        if (FileList.length > 0) {
            imageFile = FileList;

            var $continer = ""

            for (var i = 0; i < imageFile.length; i++) {
                var imageSrc = URL.createObjectURL(imageFile[i]);

                $continer += '<div class="col-md-3" style="margin-top:20px;">\
                                <div style="width : 100%;height : 300px;border : 1px solid;text-align : center;">\
                                    <img id="agreement_document_image" name="agreement_document_image" style="width : 100%;height: 100%;"  src="'+ imageSrc + '" />\
                                </div>\
                            </div>'
            };

            $("#uploadedSubImagesSection").append($continer)

        }

    })


    

    function productTable(dataObj) {
        (function rec(d) {
            $.each(d, function (k, v) {
                if (typeof v === 'object') return rec(v)
                if (isNaN(v) && typeof v === 'number') d[k] = '---';
            })
        })(dataObj);

        if ($.fn.dataTable.isDataTable("#productListDT")) {
            $("#productListDT").DataTable().destroy();
        }

        var productListDatatable = $("#productListDT").DataTable({
            data : dataObj,
            responsive: true,
            paging: true,
            searching: true,
            "scrollY": false,
            "scrollCollapse": true,
            "order": [0, "desc"],
            "pageLength": 10,
            "bLengthChange": false,
            "scrollX": false,
            columns : [
                {
                    "title" : "Id",
                    "data" : "id"
                },
                {
                    "title" : "Product",
                    "data" : "name"
                },
                {
                    "title" : "Artist",
                    "data" : "artist_name"
                }
            ],
            columnDefs: [
                {
                    "targets" : 1,
                    "render" : (data , type , row) =>{
                        return (
                            '<ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">\
                                <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up me-2" title={{obj.first_name}} data-bs-original-title="Lilian Fuller" style="width:45px;height:45px">\
                                    <img src="../../media/'+row.primary_image+'" alt="Avatar" class="rounded-circle">\
                                </li>\
                                <li>'+data+'</li>\
                            </ul>'
                        )
                    }
                },
                {
                    "targets" : 2,
                    "render" : (data , type , row) =>{
                        return (
                            '<ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">\
                                <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up me-2" title={{obj.first_name}} data-bs-original-title="Lilian Fuller" style="width:45px;height:45px">\
                                    <img src="../../media/'+row.artist_image+'" alt="Avatar" class="rounded-circle">\
                                </li>\
                                <li>'+data+'</li>\
                            </ul>'
                        )
                    }
                },{
                    "targets" : 3,
                    "title" : "Action",
                    "data" : null,
                    "render" : (data , type , row) =>{
                        var btnName = "";
                        var sellBtnContainer = "";
                        if(row.is_sold){
                            btnName = "View";
                            sellBtnContainer = "";
                        }else{
                            btnName = "Edit";
                            sellBtnContainer = "<button type='button' class='btn btn-outline-danger SellBtn' data-val='" + JSON.stringify(row) + "' >\
                                                    <i class='menu-icon tf-icons bx bx-edit'></i> Sell </button>"
                        }

                        



                        return (
                            "<button type='button' class='btn btn-outline-primary EditBtn' data-val='" + JSON.stringify(row) + "' >\
                            <i class='menu-icon tf-icons bx bx-edit'></i> "+btnName+" </button> "+sellBtnContainer
                        )
                    }
                }
            ]

        })
    };


    $("#productListDT").on("click" , ".EditBtn" , function()
    {
        $("#addProductForm").trigger("reset");
        var thisData = $(this).data("val");

        console.log('var thisProductData = ' + thisData);

        $("#ProductId").val(thisData.id);
        $("#name").val(thisData.name);
        $("#artist").val(thisData.artist_id).trigger('change');
        $("#price").val(thisData.price);
        $("#description").val(thisData.description);

        $("#primary_img").attr("src","../../media/" + thisData.primary_image);
        $("#primary_img_file").attr("required" , false);

        $("#uploadedSubImagesSection").empty();

        var $continer = ""

        for (var i = 0; i < (thisData.sub_images).length; i++) {

            $continer += '<div class="col-md-3" style="margin-top:20px;">\
                            <div style="width : 100%;height : 300px;border : 1px solid;text-align : center;">\
                                <img id="agreement_document_image" name="agreement_document_image" style="width : 100%;height: 100%;"  src="../../media/'+ thisData.sub_images[i].image + '" />\
                            </div>\
                        </div>'
        };

        $("#uploadedSubImagesSection").append($continer);
        thisData.is_sold ? $(".submitBtnSection").hide() : $(".submitBtnSection").show();
        $(".submitBtn").text("Save Changes");

        $(".productListDTSection").hide();
        $(".addNewBtnSection").hide();

        $(".backBtnSection").show();
        $(".productCreateSection").show();
    });


    // Sell Btn Event

    $("#productListDT").on("click" , ".SellBtn" , function(){
        var thisData = $(this).data('val');
        console.log("This Sell Id = ",thisData);

        Swal.fire({
            title: '<span class="trashIcon" style="color: #621aff"><i class="fa fa-info-circle me-1"></i></span>',
            html: '<div class="row" style="margin-top:15px">\
                <div class="col-md-12">\
                        <div class= "titleSection text-center">\
                            <h4>Are You Confirm to Sell <b>"'+thisData.name+'"</b></h4>\
                        </div>\
                </div >\
            </div >',
            showCloseButton: false,
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            cancelButtonColor: 'grey',
            confirmButtonText: "Confirm",
            confirmButtonColor: '#22CC62',
            focusConfirm: false,    
        }).then(function (result) {
            if (result.value == true) {
                $.ajax({
                    type : 'GET',
                    url : $("#SellProductURL").data('url')+"?product_id="+thisData.id,
                    success : (data) =>{
                        location.reload();
                    },
                    error : (err) =>{
                        console.log(err);
                    }
                })
            } else if (result.dismiss == 'cancel') {
                return false
            }
        })

        
    })


})


$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
    $($.fn.dataTable.tables(true)).DataTable()
       .columns.adjust();
 });