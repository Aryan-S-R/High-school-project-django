$(document).ready(function()
{
    $("#product").select2();
    var ProductData = [];
    $.ajax({
        type : 'GET',
        url : $("#GetProductDataURL").data('url'),
        success : (data) =>{
            $("#product").select2({
                data : data['product_data'],                
                placeholder: "Select Product",
                allowClear: true,
                templateResult : formatProductSelect2
            });
            ProductData = data['product_data']
            $("#product").val("").trigger('change')
        },
        error : (err) =>{
            console.log(err);
        }
    });

    $("#product").change(function(){
        var thisVal = $(this).val()
        if(thisVal !== null){
            var product = ProductData.find(obj => obj.id == thisVal);
            $(".thisSliderArtImage").attr("src" , "../../../media/"+product.primary_image);
            $(".thisSliderArtistImage").attr("src" , "../../../media/"+product.artist_image);
            $(".thisSliderArtName").text(product.name);
            $(".thisSliderArtistName").text(product.artist_name);
            $("#has_link_cb").prop("checked" , false).trigger("change");
            $(".sliderInfo").show();
        }else{
            $(".sliderInfo").hide();
        }
    });

    $("#has_link_cb").change(function(){
        var checked = $(this).is(":checked");
        if(checked){
            $("#link_url").attr("required" , "required");
            $(".LinkUrlView").show();
        }
        else{
            $("#link_url").attr("required" , false);
            $(".LinkUrlView").hide();
        }

        $("#link_url").val("");
        $("#has_link").val(checked)
    });

    function formatProductSelect2(state) {
        if(state.id)
        {
            var container = $(
                '<ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">\
                    <li class="fw-bold"><span style="margin-right:15px"> <img style="height:40px;width:40px;object-fit:cover;border-radius:50%" src="../../media/'+state.primary_image+'" /> </span> <span>'+state.text+'</span> \
                     [ <span>Artist : '+state.artist_name+'</span> ] \
                    </li>\
                </ul>'
            )
        }
        return container
    };

    $(".addNewbtn").click(function()
    {
        $("#addSliderForm").trigger("reset");
        $("#SliderId").val("0");
        $(".submitBtn").text("Add");
        $("#slider_img").attr("src", "../../static/img/no_image.jpg");
        $("#img").attr('required' , 'required');
        $("#product").val("").trigger('change'); 
        $(".sliderListDTSection").hide();
        $(".addNewBtnSection").hide();
        $(".backBtnSection").show();
        $(".sliderCreateSection").show();
    });


    $(".backBtn").click(function()
    {
        $(".backBtnSection").hide();
        $(".sliderCreateSection").hide();
        $(".sliderListDTSection").show();
        $(".addNewBtnSection").show();
    });


    $.ajax({
        type : 'GET',
        url : $("#GetSliderDataURL").data('url'),
        success : (data) =>{
            sliderTable(data['slider_data']);
        },
        error : (err) =>{
            console.log(err);
        }
    })

    function sliderTable(dataObj) {
        (function rec(d) {
            $.each(d, function (k, v) {
                if (typeof v === 'object') return rec(v)
                if (isNaN(v) && typeof v === 'number') d[k] = '---';
            })
        })(dataObj);

        if ($.fn.dataTable.isDataTable("#sliderListDT")) {
            $("#sliderListDT").DataTable().destroy();
        }

        var sliderListDatatable = $("#sliderListDT").DataTable({
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
                    "data" : "product_name"
                },
                {
                    "title" : "Artist",
                    "data" : "artist_name"
                }
            ],
            columnDefs: [
                {
                    "targets" : 0,
                    "visible" : false
                },
                {
                    "targets" : 1,
                    "render" : function(data , type , row){
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
                    "render" : function(data , type , row){
                        return (
                            '<ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">\
                                <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up me-2" title={{obj.first_name}} data-bs-original-title="Lilian Fuller" style="width:45px;height:45px">\
                                    <img src="../../media/'+row.artist_image+'" alt="Avatar" class="rounded-circle">\
                                </li>\
                                <li>'+data+'</li>\
                            </ul>'
                        )
                    }
                },
                {
                    "targets" : 3,
                    "title" : "Action",
                    "data" : null,
                    "render" : function(data , type , row){
                        return ("<button type='button' class='btn btn-outline-primary EditBtn' data-val='" + JSON.stringify(row) + "' >\
                        <i class='menu-icon tf-icons bx bx-edit'></i> Edit</button>\
                        <button type='button' class='btn btn-outline-primary DeleteBtn' data-val='" + JSON.stringify(row.id) + "' >\
                        <i class='menu-icon tf-icons bx bx-trash'></i> Delete</button>")
                    }
                },
            ]
        })
    };

    $("#sliderListDT").on("click" , ".EditBtn" , function()
    {
        var thisData = $(this).data("val");

        $("#SliderId").val(thisData.id);
        $("#product").val(thisData.product_id).trigger("change");
        $("#tagline").val(thisData.tagline);
        $("#has_link_cb").prop("checked" , thisData.has_link).trigger("change");
        $("#link_url").val(thisData.link_url);
        $(".submitBtn").text("Save Changes");
        $(".sliderListDTSection").hide();
        $(".addNewBtnSection").hide();
        $(".backBtnSection").show();
        $(".sliderCreateSection").show();
    });


    $("#sliderListDT").on("click" , ".DeleteBtn" , function(){
        var thisId = $(this).data('val');

        Swal.fire({
            title: '<span class="trashIcon" style="color: #621aff"><i class="fa fa-info-circle me-1"></i></span>',
            html: '<div class="row" style="margin-top:15px">\
                <div class="col-md-12">\
                        <div class= "titleSection text-center">\
                            <h4>Are You Confirm to Delete</h4>\
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
                    url : $("#DeleteSliderURL").data('url')+"?slider_id="+thisId,
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