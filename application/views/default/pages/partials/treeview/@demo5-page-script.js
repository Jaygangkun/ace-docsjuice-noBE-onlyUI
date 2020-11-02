jQuery(function($) {

    function parseJSONToCSVStr(jsonData) {
    
        let keys = Object.keys(jsonData);
    
        let columnDelimiter = ',';
        let lineDelimiter = '\n';
    
        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;
    
        keys.forEach((key, index) => {
            if( (index > 0) && (index < keys.length-1) ) {
                csvStr += columnDelimiter;
            }
            csvStr += jsonData[key];
        });
    
        return encodeURIComponent(csvStr);;
    }

    function OBJtoXML(obj) {
        var xml = '';
        for (var prop in obj) {
          xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
          if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
              xml += "<" + prop + ">";
              xml += OBJtoXML(new Object(obj[prop][array]));
              xml += "</" + prop + ">";
            }
          } else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
          } else {
            xml += obj[prop];
          }
          xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
        }
        var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
        return xml
    }

    var endScopeObj = {};
    window.obj2xml = function (obj, opt) {
        if (!opt) opt = {};
        var rootName = opt.rootName || 'root';
        var declaration = opt.declaration === 'auto' ? '<?xml version="1.0" encoding="utf-8"?>' : opt.declaration;
        var indentation = opt.indentation || 0;
        var generateDtd = (opt.doctype === 'auto' || opt.doctype === 'generate') && declaration;
        var useAttributes = opt.attributes === false ? false : true;
        var scope_indent = 0;
        if (generateDtd) {
            var dtdAttr = {};
            var dtdElem = {};
        }
        var ret = [];
        var tagContent, isArr, curs, _t, _ti, key, innerKey, name, queue = [obj, rootName];
        while (queue.length > 0) {
            name = queue.pop();
            curs = queue.pop();
            if (generateDtd)
                dtdElem[name] = dtdElem[name] || {};
            if (curs === endScopeObj) {
                scope_indent--;
                if (indentation > 0) ret.push('\n', ' '.repeat(indentation * scope_indent));
                ret.push('</', name, '>');
                continue;
            }
            if (typeof curs === 'object') {
                queue.push(endScopeObj);
                queue.push(name);
                tagContent = [name];
                isArr = Array.isArray(curs);
                if (isArr && generateDtd) {
                    dtdElem[name][name + 'Item*'] = true;
                }
                for (key in curs) {
                    if (curs.hasOwnProperty(key)) {
                        if (isArr) {
                            queue.push(curs[key]);
                            queue.push(name + 'Item');
                        } else if (typeof curs[key] == 'object' || useAttributes === false) {
                            queue.push(curs[key]);
                            queue.push(key);
                            if (generateDtd)
                                dtdElem[name][key] = true;
                        } else {
                            if (generateDtd) {
                                dtdAttr[name] = dtdAttr[name] || {};
                                dtdAttr[name][key] = true;
                            }
                            tagContent.push(key + '=' + '"' + curs[key] + '"');
                        }
                    }
                }
                if (indentation > 0) ret.push('\n', ' '.repeat(indentation * scope_indent));
                ret.push('<', tagContent.join(' '), '>');
                scope_indent++;
            } else {
                if (generateDtd)
                    dtdElem[name]['#PCDATA'] = true;
                if (indentation > 0) ret.push('\n', ' '.repeat(indentation * scope_indent));
                ret.push('<');
                ret.push(name);
                ret.push('>');
                ret.push(curs);
                ret.push('</');
                ret.push(name);
                ret.push('>');
            }
        }
        if (generateDtd) {
            var dtd = ['<!DOCTYPE ', rootName, ' ['];
            for (key in dtdAttr) {
                if (dtdAttr.hasOwnProperty(key)) {
                    for (innerKey in dtdAttr[key]) {
                        if (dtdAttr[key].hasOwnProperty(innerKey)) {
                            if (indentation > 0) dtd.push('\n');
                            dtd.push('<!ATTLIST ', key, ' ', innerKey, ' CDATA #IMPLIED>');
                        }
                    }
                }
            }
            for (key in dtdElem) {
                if (dtdElem.hasOwnProperty(key)) {
                    innerKey = null;
                    _t = ['<!ELEMENT ', key, ' ('];
                    _ti = [];
                    for (innerKey in dtdElem[key]) {
                        if (dtdElem[key].hasOwnProperty(innerKey)) {
                            _ti.push(innerKey);
                        }
                    }
                    if (indentation > 0) dtd.push('\n');
                    if (innerKey === null) // no children
                        dtd.push('<!ELEMENT ', key, ' EMPTY>');
                    else {
                        _t.push(_ti.join(', '));
                        _t.push(')>');
                        dtd.push.apply(dtd, _t);
                    }
                }
            }
            dtd.push(']>');
            ret.unshift.apply(ret, dtd);
        } else if (declaration)
            ret.unshift(opt.doctype ? opt.doctype : '<!DOCTYPE ' + rootName + '>');
        if (declaration) ret.unshift(declaration);
        return ret.join('');
    };

    function exportToCsvFile() {
        // let csvStr = parseJSONToCSVStr(formData);
        // let csvStr = OBJtoXML(formData);
        let csvStr = obj2xml(formData);
        let dataUri = 'data:text/xml;charset=utf-8,'+ csvStr;
    
        let exportFileDefaultName = 'data.xml';
    
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    $(document).on('click', '#btn_export', function(e){
        e.preventDefault();
        exportToCsvFile();

    })

    var US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

    var COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Congo {Democratic Rep}","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland {Republic}","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar, {Burma}","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

    var formDataLading = {
        "id": "123",
        "bolNumber": "MAEU4563210425",
        "houseBolNumber": "HBMAEU4563210",
        "masterBolNumber": "MBLMAEU4563210",
        "scacCode": "EGLV",
        "containers": [
            {
                "number": "MAEU4563210",
                "seal": "HOOBUY807KG",
                "size": "40HQ",
                "wt": "40T",
                "vol": "40CBM"
            },
            {
                "number": "EGPU1234576",
                "seal": "BUYSELL100PM",
                "size": "40HQ",
                "wt": "50T",
                "vol": "50CBM"
            }
        ],
        "shipper": {
            "partyName": "Shipper International",
            "streetAddress": "10 Downing Street",
            "city": "Yantian",
            "state": "Hwang Ho",
            "country": "Vietnam"
        },
        "manufacturer": {
            "partyName": "Manufacturer International",
            "streetAddress": "365 Factory Lane",
            "city": "Bangalore",
            "state": "Tennesse",
            "country": "Vietnam"
        },
        "consignee": {
            "partyName": "Consignee International",
            "streetAddress": "247 Consignee St",
            "city": "Mumbai",
            "state": "California",
            "country": "USA"
        },
        "notifyParty": {
            "partyName": "NP-ABC Corp",
            "streetAddress": "3400 Notifiers Blvd",
            "city": "Honolulu",
            "state": "Hawaii",
            "country": "Vietnam"
        },
        "notifyParty2": {},
        "preCarrierName": "Prek Small Boat",
        "carrierName": "MSC Hahakaar",
        "startPort": "Yantian, China",
        "endPort": "Long Beach, USA",
        "finalDelivery": "Sacramento, California",
        "etd": "11/15/2020",
        "etdTimezone": "Asia/Shangai",
        "eta": "12/23/2020",
        "etaTimezone": "America/Los_Angeles",
        "placeIssued": "Factory Town, China",
        "dateIssued": "10/31/2020"
    };

    var formDataInvoice = {
        "invoiceId": "123", 
        "invoiceNumber": "CUST-A12-567", 
        "invoiceDate": "12/23/2020", 
        "customer": {
            "partyName" : "Importer International", 
            "streetAddress": "10 Importer Street", 
            "city" : "Yantian", 
            "state": "Hwang Ho", 
            "country": "Vietnam"
        }, 
        "seller": {
            "partyName" : "Seller International", 
            "streetAddress": "10 Seller Lane", 
            "city" : "Sellerville", 
            "state": "Hwang Ho", 
            "country": "Belgium"
        }, 
        "consignee" : {
            "partyName" : "Consignee International", 
            "streetAddress": "247 Consignee St", 
            "city" : "Mumbai", 
            "state": "California", 
            "country": "USA"
        }, 
        "etd" : "11/15/2020", 
        "etdTimezone" : "Asia/Shangai", 
        "eta" : "12/23/2020", 
        "etaTimezone" : "America/Los_Angeles", 
        "po": "PO-45321", 
        "lineItems": [
            {
                "itemNumber": "A123", 
                "sku": "ABC-444", 
                "desc": "A123 dummy description", 
                "unitPrice": "12.40", 
                "currency": "USD", 
                "qty": 100, 
                "totalPrice": 1240, 
                "wt": "4000 lbs", 
                "vol": "40 CBM"
            },
            {
                "itemNumber": "B345", 
                "sku": "ABC-222", 
                "desc": "B345 dummy description", 
                "unitPrice": "5.75", 
                "currency": "USD", 
                "qty": 200, 
                "totalPrice": 11500, 
                "wt": "3000 lbs", 
                "vol": "35 CBM"
            },
            {
                "itemNumber": "C222", 
                "sku": "ABC-111", 
                "desc": "C222 dummy description", 
                "unitPrice": "1.40", 
                "currency": "USD", 
                "qty": 100, 
                "totalPrice": 140, 
                "wt": "2400 lbs", 
                "vol": "30 CBM"
            }
        ]
    };

    var formData = {};
    if(localStorage.getItem('doc_type') != null){
        if(localStorage.getItem('doc_type') == 'lading'){
            formData = formDataLading
        }
        else{
            formData = formDataInvoice;
        }
    }

    var grid_data = 
	[ 
		{sku:"1",description:"Desktop Computer",unitprice:1,qty:10,totalprice:10},
		{sku:"2",description:"Laptop",unitprice:2,qty:10,totalprice:20},
		{sku:"3",description:"LCD Monitor",unitprice:1,qty:10,totalprice:10},
		{sku:"4",description:"Speakers",unitprice:1,qty:10,totalprice:10},
		{sku:"5",description:"Laser Printer",unitprice:1,qty:10,totalprice:10},
		{sku:"6",description:"Play Station",unitprice:1,qty:10,totalprice:10},
		{sku:"7",description:"Mobile Telephone",unitprice:1,qty:10,totalprice:10},
		{sku:"8",description:"Server",unitprice:1,qty:10,totalprice:10},
		{sku:"9",description:"Matrix Printer",unitprice:1,qty:10,totalprice:10},
		{sku:"10",description:"Desktop Computer",unitprice:1,qty:10,totalprice:10},
		{sku:"11",description:"Laptop",unitprice:1,qty:10,totalprice:10},
		{sku:"12",description:"LCD Monitor",unitprice:1,qty:10,totalprice:10},
		{sku:"13",description:"Speakers",unitprice:1,qty:10,totalprice:10},
		{sku:"14",description:"Laser Printer",unitprice:1,qty:10,totalprice:10},
		{sku:"15",description:"Play Station",unitprice:1,qty:10,totalprice:10},
		{sku:"16",description:"Mobile Telephone",unitprice:1,qty:10,totalprice:10},
		{sku:"17",description:"Server",unitprice:1,qty:10,totalprice:10},
		{sku:"18",description:"Matrix Printer",unitprice:1,qty:10,totalprice:10},
		{sku:"19",description:"Matrix Printer",unitprice:1,qty:10,totalprice:10},
		{sku:"20",description:"Desktop Computer",unitprice:1,qty:10,totalprice:10},
		{sku:"21",description:"Laptop",unitprice:1,qty:10,totalprice:10},
		{sku:"22",description:"LCD Monitor",unitprice:1,qty:10,totalprice:10},
		{sku:"23",description:"Speakers",unitprice:1,qty:10,totalprice:10}
	];

	var subgrid_data = 
	[
		{id:"1", name:"sub grid item 1", qty: 11},
		{id:"2", name:"sub grid item 2", qty: 3},
		{id:"3", name:"sub grid item 3", qty: 12},
		{id:"4", name:"sub grid item 4", qty: 5},
		{id:"5", name:"sub grid item 5", qty: 2},
		{id:"6", name:"sub grid item 6", qty: 9},
		{id:"7", name:"sub grid item 7", qty: 3},
		{id:"8", name:"sub grid item 8", qty: 8}
    ];
    
    //change buttons colors in dialogs
	function style_edit_form(form) {
		form = $(form);
		//enable datepicker on "sdate" field and switches for "stock" field
		form.find('input[name=sku]').attr('type', 'string');
		//form.find('input[name=stock]').attr('style', 'width: 1.25rem !important;');
		
		//update buttons classes
		var buttons = form.parent().next().find('.EditButton .fm-button').attr('href', '#');//to disable for Bootstrap's "a:not([href])" style
		buttons.eq(0).removeClass('btn-default').addClass('btn-light-success border-2 text-600');
		buttons.eq(1).removeClass('btn-default').addClass('btn-light-grey border-2');
		
		//update next / prev buttons
		buttons = form.parent().next().find('.navButton .fm-button').removeClass('btn-default').addClass('px-25 mx-2px btn-outline-secondary btn-h-outline-primary btn-a-outline-primary radius-round');
	}

	function style_delete_form(form) {
		form = $(form);
		var buttons = form.parent().next().find('.EditButton .fm-button').attr('href', '#');
		buttons.eq(0).removeClass('btn-default').addClass('btn-light-danger border-2 text-600');
		buttons.eq(1).removeClass('btn-default').addClass('btn-light-grey border-2');
	}	

	function style_search_form(form) {
		form = $(form);
		
		var dialog = form.closest('.ui-jqdialog');
		var buttons = dialog.find('.EditTable').addClass('text-white');

		buttons.find('.EditButton a').removeClass('btn-default');
		buttons.find('.EditButton a[id*="_reset"]').addClass('btn-default');
		buttons.find('.EditButton a[id*="_query"]').addClass('btn-grey');
		buttons.find('.EditButton a[id*="_search"]').addClass('btn-primary');
	}
	

	//enable tooltips
	function enableTooltips(table) {
		$('.navtable .ui-pg-button').tooltip({container:'body', trigger: 'hover'});
		$(table).find('.ui-pg-div').tooltip({container:'body', trigger: 'hover'});
    }
    
    var country_html = '';
    for(var index = 0; index < COUNTRIES.length; index++){
        country_html += '<option>' + COUNTRIES[index] + '</option>';
    }
    $('#country').append(country_html);

    var state_html = '';
    for(var index = 0; index < US_STATES.length; index++){
        state_html += '<option>' + US_STATES[index] + '</option>';
    }
    $('#state').append(state_html);

    $('.autocomplete-dropdown').select2();
    var form_keys = Object.keys(formData);
    for(var index = 0; index < form_keys.length; index++){
        var form_label_name = form_keys[index];
        var form_field_value = formData[form_label_name];
        if(typeof form_field_value === 'string'){
            var form_input = $('#form_input_template').clone();
            $(form_input).find('.form-field-name').html(form_label_name);
            $(form_input).find('input').attr('value', form_field_value);
            $(form_input).find('input').addClass('has-content');
            $('#json_form').append(form_input.html());
        }
        else if(Array.isArray(form_field_value)){
            // getting column names
            var caption = form_label_name;
            var colNames = [''];
            if(form_field_value.length > 0){
                var colNames_tmp = Object.keys(form_field_value[0]);
                for(var i = 0; i < colNames_tmp.length; i++){
                    colNames.push(colNames_tmp[i]);
                }
            }

            var colModel = [
                {
                    resizable: false,
                    name: 'myac',
                    index: '',
                    width:80,
                    fixed:true,
                    sortable:false, 
                    formatter:'actions', 
                    formatoptions: {
                        keys:true,
                        //delbutton: false,//disable delete button
                        delOptions:{
                            recreateForm: true,
                            beforeShowForm: style_delete_form
                        },
                        //editformbutton:true,
                        //editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                    }
                }
            ];

            for(var cindex = 1; cindex < colNames.length; cindex++){
                colModel.push(
                    {
                        resizable: false,
                        name: colNames[cindex],
                        index: colNames[cindex],
                        // width:60,
                        // sorttype:"string",
                        editable: true
                    }
                )
            }

            console.log('colNames', colNames);
            console.log('colModel', colModel);

            var table_template = $("#table_template").clone();
            $(table_template).find('table').attr('id', 'field-grid-table-' + index)
            $(table_template).find('.table-pager').attr('id', 'field-grid-pager-' + index)
            $('#json_form').append($(table_template).html());

            var grid_selector = "#field-grid-table-" + index;
            var pager_selector = "#field-grid-pager-" + index;
            
            $(grid_selector).jqGrid({
                //direction: "rtl",
        
                iconSet: "icons4ace",
                guiStyle: "bootstrap4ace",
                 
                multiselectWidth: 36,		
                
                data: form_field_value,
                datatype: "local",
                height: 360,//optional
        
                //sortable: true,// requires jQuery UI Sortable
            
                // colNames:[' ', 'SKU','Description','Unit Price', 'Qty', 'Price'],
                colNames: colNames,
                colModel: colModel,
                // colModel:[
                //     {
                //         resizable: false,
                //         name: 'myac',
                //         index: '',
                //         width:80,
                //         fixed:true,
                //         sortable:false, 
                //         formatter:'actions', 
                //         formatoptions: {
                //             keys:true,
                //             //delbutton: false,//disable delete button
                //             delOptions:{
                //                 recreateForm: true,
                //                 beforeShowForm: style_delete_form
                //             },
                //             //editformbutton:true,
                //             //editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                //         }
                //     },
                //     {
                //         resizable: false,
                //         name: 'sku',
                //         index: 'sku',
                //         width:60,
                //         sorttype:"string",
                //         editable: true
                //     },
                //     {
                //         resizable: false,
                //         name: 'description',
                //         index: 'description',
                //         width: 90,
                //         editable: true
                //     },
                //     {
                //         resizable: false,
                //         name:'unitprice',
                //         index:'unitprice', 
                //         width:30,
                //         editable: true,
                //         editoptions: {
                //             size:"20",
                //             maxlength:"30"
                //         }
                //     },
                //     {
                //         resizable: false,
                //         name:'qty',
                //         index:'qty', 
                //         width:30, 
                //         editable: true,
                //         editoptions: {
                //             size:"20",
                //             maxlength:"30"
                //         }
                //     },
                //     {
                //         resizable: false,
                //         name:'totalprice',
                //         index:'totalprice', 
                //         width:30,
                //         editable: true,
                //         editoptions:{
                //             size:"20",
                //             maxlength:"30"
                //         }
                //     }
                // ],
        
                
                altRows: true,
                altclass: 'bgc-default-l4',
        
                viewrecords : true,
                rowNum: 10,
                rowList:[10,20,30],
                
                pager : pager_selector,
                //toppager: true,
                
                multiselect: true,		
                multiboxonly: true,
                //multikey: "ctrlKey",
        
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size
                        enableTooltips(table);
                    }, 0);
                },
        
                editurl: null,//nothing is saved
                // caption: "Line Items",
                caption: caption,
        
                //autowidth: true, shrinkToFit: true,
                autowidth: true,
                shrinkToFit: $(window).width() > 600,
                forceFit: true,
        
                grouping: false,
                groupingView : {
                    groupField : ['name'],
                    groupDataSorted : true,
                    plusicon : 'fa fa-chevron-down px-2 w-auto text-primary-m3 bgc-h-primary-l2 py-1 mx-1 radius-1',
                    minusicon : 'fa fa-chevron-up px-2 w-auto text-primary-m3 bgc-h-primary-l2 py-1 mx-1 radius-1'
                },
                
        
                //subgrid options
                subGridWidth: 36,
                subGrid : true,
                subGridOptions : {
                    plusicon : "fas fa-angle-double-down text-secondary-m2 text-90",
                    minusicon  : "fas fa-angle-double-up text-info-m1 text-95",
                    openicon : "fas fa-fw fa-reply fa-rotate-180 text-orange-d1"
                },
        
                //for this example we are using local data
                subGridRowExpanded: function (subgridDivId, rowId) {
                    var subgridTableId = subgridDivId + "_t";
                    $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
                    $("#" + subgridTableId).jqGrid({
                        datatype: 'local',
                        guiStyle: "bootstrap4ace",
                        data: subgrid_data,
                        colNames: ['No','Item Name','Qty'],
                        colModel: [
                            { name: 'id', width: 50 },
                            { name: 'name', width: 150 },
                            { name: 'qty', width: 50 }
                        ]
                    });
                },
        
                //resize grid after pagination
                onPaging : function(pgButton){			
                    setTimeout(function() {
                        $(grid_box).hide();
                        $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
                        $(grid_box).show();
                    }, 0);
                },
                
            });
            
        
            //enable search/filter toolbar
            //jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})
            //jQuery(grid_selector).filterToolbar({});
        
        
            //navButtons
            $(grid_selector).jqGrid('navGrid', pager_selector,
                {	//navbar options
                      add: true,
                    addicon : 'fa fa-plus-circle text-purple-m1 text-100',
                    
                      edit: true,
                    editicon : 'fa fa-edit text-blue-m1 text-100',
                    
                    del: true,
                    delicon : 'fa fa-trash text-danger-m2 text-100',
                    
                    search: true,
                    searchicon : 'fa fa-search text-orange-d1 text-100',
                    
                    refresh: true,
                    refreshicon : 'fa fa-sync text-success-m1 text-100',
        
                    view: true,
                      viewicon : 'fa fa-search-plus text-grey-d1 text-100',
              
                },
                {
                    //edit record form
                    //closeAfterEdit: true,
                    width: 320,
                    recreateForm: true,
                    beforeShowForm : function(e) {
                        style_edit_form(e[0]);
                    }
                },
                {
                    //new record form
                    width: 320,
                    closeAfterAdd: true,
                    recreateForm: true,
                    viewPagerButtons: false,
                    beforeShowForm : function(e) {
                        style_edit_form(e[0]);
                    }
                },
                {
                    //delete record form
                    recreateForm: true,
                    beforeShowForm : function(e) {
                        style_delete_form(e[0]);
                    },
                    onClick : function(e) {
                    }
                },
                {
                    //search form
                    recreateForm: true,
                    afterShowSearch: function(e){
                        style_search_form(e[0]);
                    },
                    afterRedraw: function(e){
                    },
                    multipleSearch: true,
                    
                    //multipleGroup:true,
                    //showQuery: true
                },
                {
                    //view record form
                    recreateForm: true,
                    beforeShowForm: function(e){
                        style_edit_form(e[0]);
                        e[0].querySelector('tr[data-rowpos="1"]').classList.add('d-none');
                    }
                }
            );
        }
        else if(typeof form_field_value === 'object'){
            var form_field_keys = Object.keys(form_field_value);
            var form_fieldset = $('#form_field_set_template').clone();
            $(form_fieldset).find('legend').text(form_label_name);
            for(var sindex = 0; sindex < form_field_keys.length; sindex++){
                var form_label_field_s = form_field_keys[sindex];
                var form_field_value_s = form_field_value[form_label_field_s];
                var form_input = $('#form_input_template').clone();
                $(form_input).find('.form-field-name').html(form_label_field_s);
                $(form_input).find('input').attr('value', form_field_value_s);
                $(form_input).find('input').addClass('has-content');
                $(form_fieldset).find('fieldset').append(form_input.html());
            }

            $('#json_form').append(form_fieldset.html())
        }        
    }
    var pageData = {
        "pages": [
            {
                "pageIndex": "1",
                "pageLocation": "https://s3.amazon.com/bucketname/image",
                "docType": "INVOICE",
                "boxes": [
                    {
                        "boxId": "123",
                        "boxIndex": "1",
                        "class" : "10",
                        "boxLoc": "[10,20,40,50]"
                    },
                    {
                        "boxId": "234",
                        "boxIndex": "2",
                        "class" : "12",
                        "boxLoc": "[100,120,170,180]"
                    },
                    {
                        "boxId": "345",
                        "boxIndex": "3",
                        "class" : "13",
                        "boxLoc": "[110,320,180,350]"
                    },
                    {
                        "boxId": "456",
                        "boxIndex": "4",
                        "class" : "10",
                        "boxLoc": "[410,420,540,450]"
                    }
                ]
            },
            {
                "pageIndex": "2",
                "pageLocation": "https://s3.amazon.com/bucketname/image",
                "docType": "BILL_OF_LADING",
                "boxes": [
                    {
                        "boxId": "123",
                        "boxIndex": "1",
                        "class" : "10",
                        "boxLoc": "[40,50,120,90]"
                    },
                    {
                        "boxId": "234",
                        "boxIndex": "2",
                        "class" : "12",
                        "boxLoc": "[140,150,270,180]"
                    },
                    {
                        "boxId": "345",
                        "boxIndex": "3",
                        "class" : "13",
                        "boxLoc": "[210,320,280,350]"
                    },
                    {
                        "boxId": "456",
                        "boxIndex": "4",
                        "class" : "10",
                        "boxLoc": "[630,600,700,650]"
                    }
                ]
            } ,
            {
                "pageIndex": "3",
                "pageLocation": "https://s3.amazon.com/bucketname/image",
                "docType": "BILL_OF_LADING",
                "boxes": [
                    {
                        "boxId": "123",
                        "boxIndex": "1",
                        "class" : "10",
                        "boxLoc": "[40,50,120,90]"
                    },
                    {
                        "boxId": "234",
                        "boxIndex": "2",
                        "class" : "12",
                        "boxLoc": "[140,150,270,180]"
                    },
                    {
                        "boxId": "456",
                        "boxIndex": "4",
                        "class" : "10",
                        "boxLoc": "[630,600,700,650]"
                    }
                ]
            } 
        ]
    };

    var fileData = [
        {
            id: 1,
            name: 'abc.pdf',
            icons: {
                'default': ['<i class="fas fa-file-pdf"></i>', 'text-danger-m1']
            },
            children: [
                {
                    id: 3,
                    name: 'p1' ,
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey'],
                    }
                },
                { 
                    id: 4,
                    name: 'p2' ,
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey'],
                    }
                },
                { 
                    id: 5,
                    name: 'p3' ,
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey'],
                    }
                },
                { 
                    id: 6,
                    name: 'p4',
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey']
                    },
                }
            ]
        },
        {
            id: 7,
            name: 'document.doc',
            icons: {
                'default': ['<i class="fa fa-file-word"></i>', 'text-blue2-m2']
            },
            children: [
                {
                    id: 8,
                    name: 'p1',
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey']
                    },
                }
            ]
        },
        {
            id: 9,
            name: 'pqr.xlsx',
            icons: {
                'default': ['<i class="fa fa-file-excel"></i>', 'text-blue2-m2']
            },
            children: [
                {
                    id: 10,
                    name: 'p1',
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey']
                    },
                }
            ]
        }
    ];

    if(localStorage.getItem('uploaded_files') != null){
        fileData = JSON.parse(localStorage.getItem('uploaded_files'));
    }
    console.log('fileData', fileData);

    //Select Categories Tree
    var categoryData = [];

    var boxes = new Array();
    var trs = new Array();
    // add canvas element
    var preview_layer = new Konva.Layer();
    var width = window.innerWidth;
    var height = window.innerHeight;
    width = $('#imageviewer').outerWidth();
    var total_page_count = 0;
    for(var findex = 0; findex < fileData.length; findex++){
        var pages = fileData[findex].children;
        total_page_count += pages.length;
    }
    var title_height = 30;
    var padding_height = 30;
    height = $('#imageviewer').outerHeight() * total_page_count + (title_height + padding_height) * total_page_count;

    var stage = new Konva.Stage({
        container: 'imageviewer',
        width: width,
        height: height,
    });
    preview_layer.setA
    stage.add(preview_layer);

    function drawPageContent(page_layer, file_index, page_index, drawY){
        console.log('drawPageContent', file_index, page_index, drawY);
        if(file_index < fileData.length){
            if(page_index == 0){
                var file_name = fileData[file_index].name;
                var file_id = fileData[file_index].id;
                var fileTitleText = new Konva.Text({
                    // x: stage.width() / 2,
                    x: 0,
                    y: drawY,
                    text: file_name,
                    fontSize: 30,
                    // fontFamily: 'Calibri',
                    fill: 'green',
                });
                // fileTitleText.offsetX(fileTitleText.width() / 2);
                preview_layer.add(fileTitleText);
        
                console.log('draw File Title');
                drawY += fileTitleText.height();
                drawY += padding_height;
            }

            var page_thumb_index = page_index + 1;
            if(page_thumb_index > 4){
                page_thumb_index = 1;
            }
            var imageObj = new Image();
            imageObj.src = './assets/image/page' + page_thumb_index + '.jpeg';
            imageObj.onload = function () {
                // getting x, y
                var img_width = 60;
                var img_height = 60;
                var padding_w = 20;
                var padding_h = 20;
                var stage_width = stage.width();
                var stage_height = stage.height();
                stage_height = $('#imageviewer').outerHeight();

                var x = page_index * img_width + padding_w * page_index;
                var y = 0;
                x = 0;

                var h_count = stage_width / (img_width + padding_h);
                var bk_img = new Konva.Image({
                    x: x,
                    y: drawY,
                    image: imageObj,
                    width: stage_width,
                    height: stage_height,
                    page_index: page_index
                });

                // add the shape to the layer
                page_layer.add(bk_img);

                var page_box_index = page_index % 3;

                var pageBoxes = pageData.pages[page_box_index].boxes;
                for(i = 0; i < pageBoxes.length; i++){
                    var boxLoc = JSON.parse(pageBoxes[i]['boxLoc']);

                    var box = new Konva.Rect({
                        x: boxLoc[0],
                        y: drawY + boxLoc[1],
                        width: boxLoc[2],
                        height: boxLoc[3],
                        //fill: '#000000',
                        //opacity: 0.2,
                        stroke: 'red',
                        strokeWidth: 2,
                        draggable: true,
                        name: 'rect'
                    });
                    boxes.push(box);
                    page_layer.add(box);
                }            

                drawY += stage_height;
                drawY += padding_height;
                var greenLine = new Konva.Line({
                    points: [10, drawY, stage_width - 10, drawY],
                    stroke: 'green',
                    strokeWidth: 2,
                    dash: [33, 10]
                });

                page_layer.add(greenLine);

                page_layer.draw();

                console.log('drawImage And Boxes');
                page_index ++;
                drawY += padding_height;
                if(page_index < fileData[file_index].children.length){
                    drawPageContent(page_layer, file_index, page_index, drawY);
                }
                else{
                    drawPageContent(page_layer, file_index + 1, 0, drawY);
                }
            };            
        }
        
    }

    var drawY = 0;
    drawPageContent(preview_layer, 0, 0, drawY);
    
    preview_layer.draw();
    
    var selectedIcon =
    '<span class="selected-icon d-inline-block text-center border-1 bgc-warning px-1px mx-1 text-70 pb-1px radius-2px">\
        <i class="w-2 fa fa-check text-white"></i>\
    </span>';
    
    var deselectedIcon = 
    '<span class="deselected-icon d-inline-block text-center border-1 bgc-white brc-secondary-m3 px-1px mx-1 text-70 pb-1px radius-2px">\
        <i class="w-2 fa fa-times text-orange-l4"></i>\
    </span>';

    
    /*var categoryTree = $('#id-jqtree-categories');
    categoryTree.tree({
        data: categoryData,
        autoOpen: false,
        useContextMenu: false,
 
        closedIcon : $('<i class="bgc-white w-2 far fa-plus-square text-grey-l1 text-110"></i>'),
        openedIcon : $('<i class="bgc-white w-2 far fa-minus-square text-default-d2 text-110"></i>'),

        onCreateLi: function(node, $li, is_selected) {
            // insert the icon
            var title = $li.find('.jqtree-title');
            if(node.children.length == 0) {
                title.addClass('text-grey-d2 text-95');
                if( is_selected ) {
                    $(selectedIcon).insertBefore(title);
                }
                else {
                    $(deselectedIcon).insertBefore(title);
                }
            }
            else {
                title.addClass('text-secondary-d3 font-italic');
            }
            $li.find('.jqtree-element').addClass('bgc-h-warning-l3 radius-1');
        }
    });

    categoryTree.on( 'tree.click', function(e) {
        // Disable single selection
        e.preventDefault();

        var selectedNode = e.node;
        if (selectedNode.id === undefined || selectedNode.children.length > 0) {
            return;
        }

        if( categoryTree.tree('isNodeSelected', selectedNode) ) {
            //if already selected, deselect it
            categoryTree.tree('removeFromSelection', selectedNode);

            //insert deselectedIcon and remove .selected-icon
            var icon = $(selectedNode.element).find('.selected-icon');
            $(deselectedIcon).insertAfter(icon);
            icon.remove();
        }    
        else {
            categoryTree.tree('addToSelection', selectedNode);

            //insert selectedIcon and remove .deselected-icon
            var icon = $(selectedNode.element).find('.deselected-icon');
            $(selectedIcon).insertAfter(icon);
            icon.remove();
        }
    });*/

    ///////////

    //Browse Files Tree
    var fileTree = $('#id-jqtree-files');
    

    fileTree.tree({
          data: fileData,
          autoOpen: 1,
          dragAndDrop: true,
          useContextMenu: true,

          //used to specify drag & dropped items's color         
          /*onCanMoveTo: function(node) {
            node.element.querySelector('* > .jqtree-element').classList.add('bgc-warning-l1', 'border-x-2', 'brc-warning');         
            return true;
          },*/
         
          
          closedIcon : $('<i class="fa fa-caret-right text-muted"></i>'),
          openedIcon : $('<i class="fa fa-caret-right rotate-45 text-muted"></i>'),

          onCreateLi: function(node, $li) {
              $li.find('.jqtree-element').addClass('bgc-h-warning-l3');
              
              // insert the icons
              if(node.icons) {
                  var $title = $li.find('.jqtree-title');

                  var iconDefault = null
                  // prepend the `default` icon
                  if(node.icons.default) {
                    iconDefault = $( node.icons.default[0] ).addClass( node.icons.default[1] ).addClass('node-icon');
                    $title.prepend( iconDefault );
                  }

                  // prepend the `open` icon
                  if(node.icons.open) {
                      if(iconDefault) iconDefault.addClass('closed-icon');
                        $title.prepend(
                            $( node.icons.open[0] ).addClass( node.icons.open[1] ).addClass('opened-icon').addClass('node-icon')
                        );
                  }
              }
          }
    });

    var _highlightNode = function(node) {
        var className = node.children.length > 0 ? 'bgc-success-l2' : 'bgc-primary-l2';        
        var el = node.element.querySelector('* > .jqtree-element');
        el.classList.add(className)
        el.classList.remove('bgc-h-warning-l3');
    }
    var _unhighlightNode = function(node) {
        var el = node.element.querySelector('* > .jqtree-element')
        el.classList.remove('bgc-success-l2');
        el.classList.remove('bgc-primary-l2');
        el.classList.add('bgc-h-warning-l3');
    }

    var _lastContextMenu = null, _lastDropdownItem = null;
    var _hideContextMenu = function(menu) {        
        $(menu.parentNode).removeClass('dropdown dd-backdrop dd-backdrop-none-md');
        $(menu).next().remove();
        $(menu).dropdown('dispose').remove();
        _lastContextMenu = null;
        _lastDropdownItem = null;
    }

    var highlighted = null;
    fileTree.on('tree.click', function(e) {
        // Disable single selection
        //e.preventDefault();
        console.log('tree.click', e.node);

        if (_lastContextMenu != null ) return;       
        
        
        var selectedNode = e.node;
    
        if(selectedNode.children.length != 0){
            console.log('File Click');
            showFileContent(selectedNode.id);
        }
        else{
            console.log('Page Click');
            showPageContent(selectedNode.id);
        }
        if (selectedNode.id === undefined) {
            //console.warn('The multiple selection functions require that nodes have an id');
            return;
        }
    
        if (fileTree.tree('isNodeSelected', selectedNode)) {
            fileTree.tree('removeFromSelection', selectedNode);
            _unhighlightNode(selectedNode);
            highlighted = null;
        } else {
            if (highlighted != null) {
                _unhighlightNode(highlighted);
            }
            fileTree.tree('addToSelection', selectedNode);
            _highlightNode(selectedNode);
            highlighted = selectedNode;
        }
    })
    .on('tree.contextmenu',
        function(event) {            
            if(_lastContextMenu != null) {
                if( event.node.element == _lastDropdownItem ) return;//dropdown already shown
                _hideContextMenu(_lastContextMenu);//hide previous dropdown
            }

            _lastDropdownItem = event.node.element;

            var item = event.node.element.querySelector('.jqtree-title');
            $(item).addClass('dropdown dd-backdrop dd-backdrop-none-md').append('<a href="#" class="d-none" data-toggle="dropdown">&nbsp;</a>\
            <div class="dropdown-menu dropdown-caret radius-1 border-b-2 shadow-sm brc-default-m2 dd-slide-up dd-slide-none-md"><div class="dropdown-inner">\
                <div class="d-md-none dropdown-title px-3 text-secondary-d3">'+event.node.name+'</div>\
                <div class="d-md-none dropdown-divider"></div>\
                <a href="#" class="dropdown-item"><i class="fa fa-edit text-blue mr-1 w-2"></i> Rename</a>\
                <a href="#" class="dropdown-item"><i class="fa fa-trash-alt text-danger mr-1 w-2"></i> Delete</a>\
            </div></div>');

            _lastContextMenu = item.querySelector('[data-toggle=dropdown]');
            $(_lastContextMenu.nextElementSibling).on('click', function(e) {
                //e.stopImmediatePropagation();//so that node doesn't get selected
                $(_lastContextMenu).dropdown('hide');//so that dropdown gets hidden
            });
            $(_lastContextMenu).dropdown('show').parent().one('hide.bs.dropdown', function(e) {
                _hideContextMenu( this.querySelector('[data-toggle=dropdown]') );            
            });
        }
    );

var daterange_container = document.querySelector('#id-daterange-container');
  // Inject DateRangePicker into our container
  DateRangePicker.DateRangePicker(daterange_container, {
      mode: 'dp-modal'
  })
  .on('statechange', function (_, rp) {
      // Update the inputs when the state changes
      var range = rp.state;
      $('#id-daterange-from').val( range.start ? range.start.toDateString() : '' );
      $('#id-daterange-to').val( range.end ? range.end.toDateString() : '' );
  });

  $('#id-daterange-from, #id-daterange-to').on('focus', function() {    
    daterange_container.classList.add('visible');
  });

  var daterange_wrapper = document.querySelector('#id-daterange-wrapper');
  var previousTimeout = null;
  $( daterange_wrapper ).on('focusout', function() {
      if(previousTimeout) clearTimeout(previousTimeout);
      previousTimeout = setTimeout(function() {
        if ( !daterange_wrapper.contains(document.activeElement) ) {
          daterange_container.classList.remove('visible');
        }
      }, 10);
  });

  var TinyDatePicker = DateRangePicker.TinyDatePicker;
  var dp = TinyDatePicker('#id-date-1', {
    mode: 'dp-below',
  }).on('statechange', function(ev) {
      
  });

  //typeahead.js
    //example taken from plugin's page at: https://twitter.github.io/typeahead.js/examples/
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
            
            // an array that will be populated with substring matches
            matches = [];
            
            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
            
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });

            cb(matches);
        }
    }

    var US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
    var COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Congo {Democratic Rep}","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland {Republic}","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar, {Burma}","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]

    $('input.typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1,
            classNames: {
                menu : 'dropdown-menu',
                suggestion : 'dropdown-item',
                cursor : 'bgc-yellow-m2'
            }
        },
        {
            name: 'states',
            displayKey: 'value',
            source: substringMatcher(US_STATES),
            limit: 10
        }
    );

    $('input.typeahead2').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1,
            classNames: {
                menu : 'dropdown-menu',
                suggestion : 'dropdown-item',
                cursor : 'bgc-yellow-m2'
            }
        },
        {
            name: 'states',
            displayKey: 'value',
            source: substringMatcher(COUNTRIES),
            limit: 10
        }
    );

     $('#aside-1')
    .aceAside({
        placement: 'right',
        dismiss: true,
        belowNav: true,
        extraClass: 'my-2'
    })
    
});