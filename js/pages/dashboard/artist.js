$(document).ready(function()
{
    $('#biography_input').summernote({
        height: 200
    });

    $(".popover").hide();

    function GetArtistData(){
        $.ajax({
            type : 'GET',
            url : $("#GetArtistDataURL").data('url'),
            success : (data) =>{
                console.log("Artist Data = ",(data['artist_data']));
                artistTable(data['artist_data'])
            },
            error : (err) =>{
                console.log(err);
            }
        })
    }

    GetArtistData();



    $(".addNewbtn").click(function()
    {
        $("#addArtistForm").trigger("reset");
        $("#ArtistId").val("0");
        $(".submitBtn").text("Add");

        $("#artist_img").attr("src", "../../static/img/user.png");
        $("#img").attr('required' , 'required');
        $("#biography_input").summernote("code","");

        $(".artistListDTSection").hide();
        $(".addNewBtnSection").hide();

        $(".backBtnSection").show();
        $(".artistCreateSection").show();
    });


    $(".backBtn").click(function()
    {
        $(".backBtnSection").hide();
        $(".artistCreateSection").hide();

        $(".artistListDTSection").show();
        $(".addNewBtnSection").show();
    });

    img.onchange = evt => {
        const [file] = img.files;
        if (file) {
            console.log(file)
            artist_img.src = URL.createObjectURL(file)
        }
    }


    

    function artistTable(dataObj) {
        (function rec(d) {
            $.each(d, function (k, v) {
                if (typeof v === 'object') return rec(v)
                if (isNaN(v) && typeof v === 'number') d[k] = '---';
            })
        })(dataObj);

        if ($.fn.dataTable.isDataTable("#artistListDT")) {
            $("#artistListDT").DataTable().destroy();
        }

        var artistListDatatable = $("#artistListDT").DataTable({
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
                    "title" : "Artist",
                    "data" : "name"
                }
            ],
            columnDefs: [
                {
                    "targets" : 1,
                    "render" : (data , type , row) =>{
                        return (
                            '<ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">\
                                <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up me-2" title={{obj.first_name}} data-bs-original-title="Lilian Fuller" style="width:45px;height:45px">\
                                    <img src="../../media/'+row.img+'" alt="Avatar" class="rounded-circle">\
                                </li>\
                                <li>'+data+'</li>\
                            </ul>'
                        )
                    }
                },{
                    "targets" : 2,
                    "title" : "Action",
                    "data" : null,
                    "render" : (data , type , row) =>{
                        return (
                            "<button type='button' class='btn btn-outline-primary EditBtn' data-val='" + JSON.stringify(row) + "' >\
                            <i class='menu-icon tf-icons bx bx-edit'></i> Edit </button>\
                            <button type='button' class='btn btn-outline-primary DeleteBtn' data-val='" + JSON.stringify(row) + "' >\
                            <i class='menu-icon tf-icons bx bx-edit'></i> Delete </button>"
                        )
                    }
                }
            ]

        })
    };


    $("#artistListDT").on("click" , ".EditBtn" , function()
    {
        var thisData = $(this).data("val");

        console.log("this Artist = ",thisData)

        $("#ArtistId").val(thisData.id);
        $("#name").val(thisData.name);
        $("#biography_input").summernote("code",(decodeURI(thisData.biography)));

        $("#artist_img").attr("src","../../media/" + thisData.img);
        $("#img").attr("required" , false);

        $(".submitBtn").text("Save Changes");

        $(".artistListDTSection").hide();
        $(".addNewBtnSection").hide();

        $(".backBtnSection").show();
        $(".artistCreateSection").show();
    });

    $("#artistListDT").on("click" , ".DeleteBtn" , function(){
        var thisData = $(this).data("val");
        console.log("Delete data = ",thisData);

        Swal.fire({
            title: '<span class="trashIcon" style="color: #621aff"><i class="fa fa-info-circle me-1"></i></span>',
            html: '<div class="row" style="margin-top:15px">\
                <div class="col-md-12">\
                        <div class= "titleSection text-center">\
                            <h4>Are You Confirm to Delete Artist <b>"'+thisData.name+'"</b></h4>\
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
                    url : $("#DeleteArtistDataURL").data('url')+"?artist_id="+thisData.id,
                    success : (data) =>{
                        location.reload()
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


    $("#addArtistForm").submit(function(e){
        e.preventDefault();
        var biography_input = ($('#biography_input').summernote('code')).split("\'").join("");

        console.log("biography_input = ",biography_input)

		var plainTxt = biography_input
						.replace(/<\/p>/gi, "\n")
						.replace(/<br\/?>/gi, "\n")
						.replace(/<\/?[^>]+(>|$)/g, "")
						.replace(/&nbsp;/g, " ");

		
		

		var trim_text = plainTxt.trim();

		if(trim_text == "")
		{
            iziToast.warning({
				title: 'Caution',
				message: 'You forgot to enter Biography!',
			});

			$('#biography_input').summernote('focus');
		}
		else
		{
            $("#biography_message").val(encodeURI((biography_input)));
            $("#biography").val(plainTxt);

			this.submit();
		}
  
		
    })


})


$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
    $($.fn.dataTable.tables(true)).DataTable()
       .columns.adjust();
 });