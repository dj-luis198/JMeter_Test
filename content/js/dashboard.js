/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 68.34415584415585, "KoPercent": 31.655844155844157};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5197368421052632, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cbbe6888-f911-4736-a6b0-732e04becdca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2494a306-1f17-43e3-89cb-50ef29cc1960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04684cb2-0365-45c9-b9f9-615b29c55b59"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b9da0627-afdc-4bb5-a0cc-c219ea6a72c1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8855c83-b713-4765-bed6-0bed9c3b9ca1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4345daf0-c5f5-4280-8f6b-57ac659bfd9b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7a497cf-69c9-48fd-ad58-893448c32e75"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbbe6888-f911-4736-a6b0-732e04becdca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2494a306-1f17-43e3-89cb-50ef29cc1960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fe28855-a18d-4677-b32e-8bcfe3cd6224"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4345daf0-c5f5-4280-8f6b-57ac659bfd9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fe28855-a18d-4677-b32e-8bcfe3cd6224"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b021a5a9-50da-4919-92f6-1cd4200a2a45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9265536723163842, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b021a5a9-50da-4919-92f6-1cd4200a2a45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39cf26de-0200-4f86-b3ba-d96680b512b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68f10202-7861-4468-9a7f-a236d7523419"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0625, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59565c58-0395-4488-b748-33eadfe2107f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a8e157a-c432-4edf-8585-78d5daa1bcc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c4b8de7-12a7-4131-be4f-77b74aecce2a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72e49ff1-c3ee-4df4-9dcc-9cce758a5c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b825280d-cb80-465b-9e04-a50398046bfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3d2bee1-59fe-4033-a422-163462d8bcaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5bc3f69-09f5-4489-877a-780f20cf8f64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/72e49ff1-c3ee-4df4-9dcc-9cce758a5c1b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9a8e157a-c432-4edf-8585-78d5daa1bcc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c21f5e81-ba5f-4183-a588-0c9e657e3102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59565c58-0395-4488-b748-33eadfe2107f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5bc3f69-09f5-4489-877a-780f20cf8f64"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8855c83-b713-4765-bed6-0bed9c3b9ca1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c21f5e81-ba5f-4183-a588-0c9e657e3102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9da0627-afdc-4bb5-a0cc-c219ea6a72c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3d2bee1-59fe-4033-a422-163462d8bcaa"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 616, 195, 31.655844155844157, 304.48538961038963, 127, 1723, 143.0, 737.8000000000004, 1017.6499999999997, 1491.420000000003, 2.396020117233842, 2.447725020712349, 1.150692399005418], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/cbbe6888-f911-4736-a6b0-732e04becdca", 3, 0, 0.0, 396.33333333333337, 223, 736, 230.0, 736.0, 736.0, 736.0, 0.03023675378211395, 0.025207137511716743, 0.019390105778243648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2494a306-1f17-43e3-89cb-50ef29cc1960", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.5884822882736156, 2.2457756514657983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04684cb2-0365-45c9-b9f9-615b29c55b59", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["see books", 55, 55, 100.0, 761.490909090909, 510, 1095, 813.0, 970.6, 1029.3999999999999, 1095.0, 0.23199605184900854, 1.492584826192776, 0.38945430969574774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 140.77777777777777, 131, 155, 140.0, 151.4, 155.0, 155.0, 0.10624483532050526, 0.08248500398418133, 0.03776671880533585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 210.4666666666667, 129, 433, 139.0, 420.40000000000003, 433.0, 433.0, 0.07854102197577795, 0.03904041033756931, 0.03942391142143541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9da0627-afdc-4bb5-a0cc-c219ea6a72c1", 3, 0, 0.0, 738.3333333333334, 210, 1257, 748.0, 1257.0, 1257.0, 1257.0, 0.01869019138755981, 0.025765937671326754, 0.011985571951006779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, 100.0, 137.14285714285717, 131, 146, 136.5, 143.5, 146.0, 146.0, 0.07178566850403793, 0.035682524676323546, 0.03603304063581592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8855c83-b713-4765-bed6-0bed9c3b9ca1", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4345daf0-c5f5-4280-8f6b-57ac659bfd9b", 3, 0, 0.0, 329.0, 246, 439, 302.0, 439.0, 439.0, 439.0, 0.04126433935792688, 0.03415859862864846, 0.02646183220544139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 2.106584821428571, 4.4154575892857135], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, 100.0, 250.45454545454555, 127, 701, 139.0, 543.4, 550.4, 701.0, 0.2495576024320523, 0.124047675427651, 0.12063575508190028], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 523.2857142857143, 143, 836, 472.0, 792.0, 836.0, 836.0, 0.09860196499630243, 0.018618549054477584, 0.06668150464837834], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 523.2857142857143, 143, 836, 472.0, 792.0, 836.0, 836.0, 0.10168802115110841, 0.019201274641186556, 0.06876851039760017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7a497cf-69c9-48fd-ad58-893448c32e75", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1021.375, 189, 1691, 1034.0, 1567.5, 1676.0, 1691.0, 0.10407226083977641, 0.032979930314948676, 0.046954477058571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbbe6888-f911-4736-a6b0-732e04becdca", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2494a306-1f17-43e3-89cb-50ef29cc1960", 3, 0, 0.0, 320.0, 225, 434, 301.0, 434.0, 434.0, 434.0, 0.09592939596457008, 0.043405553512614714, 0.0615172233236338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fe28855-a18d-4677-b32e-8bcfe3cd6224", 3, 0, 0.0, 350.0, 226, 494, 330.0, 494.0, 494.0, 494.0, 0.03053777013202496, 0.030627236255458625, 0.019583140351591526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 185.00000000000003, 138, 410, 142.0, 410.0, 410.0, 410.0, 0.03595514852044564, 0.02830063447996014, 0.01278093170062716], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 513.6428571428571, 139, 757, 451.0, 752.5, 757.0, 757.0, 0.10150738466223418, 0.020632848695992634, 0.06847641720622676], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1129.4583333333335, 717, 1723, 1104.5, 1526.5, 1677.75, 1723.0, 0.1015894516286059, 0.052580477893712035, 0.04672717941120447], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 291.8571428571429, 139, 880, 227.0, 669.0, 880.0, 880.0, 0.09858321831957863, 0.195240983156353, 0.06313424437723572], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 211.14285714285714, 130, 412, 140.0, 412.0, 412.0, 412.0, 0.03582706786158468, 0.017808571817916605, 0.017983508672709498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4345daf0-c5f5-4280-8f6b-57ac659bfd9b", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fe28855-a18d-4677-b32e-8bcfe3cd6224", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 801.3606557377047, 525, 1367, 761.0, 1030.6000000000001, 1196.7, 1367.0, 0.28253690348817284, 0.9090266632623285, 0.552028910241268], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b021a5a9-50da-4919-92f6-1cd4200a2a45", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 177.7857142857143, 135, 410, 140.0, 406.5, 410.0, 410.0, 0.0722707468665469, 0.05399132944619959, 0.025689992050217842], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 457.64285714285717, 140, 1003, 416.0, 996.0, 1003.0, 1003.0, 0.10173974972021568, 0.019211042305568072, 0.06962672185442495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, 5.649717514124294, 208.84745762711856, 127, 951, 143.0, 404.6, 482.9, 813.7199999999998, 0.7614245953049785, 1.606692941013254, 0.3676555596900959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 204.41666666666669, 132, 675, 139.5, 590.4000000000003, 675.0, 675.0, 0.0648792435080207, 0.05024339853697306, 0.02306254359074173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 150.94117647058823, 128, 387, 137.0, 190.19999999999982, 387.0, 387.0, 0.11667730489152443, 0.05799682440408783, 0.058566537806878476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b021a5a9-50da-4919-92f6-1cd4200a2a45", 3, 0, 0.0, 676.3333333333334, 458, 882, 689.0, 882.0, 882.0, 882.0, 0.026549847338377803, 0.026627630094251956, 0.017025781008009205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 158.93333333333334, 133, 394, 143.0, 249.4000000000001, 394.0, 394.0, 0.10311404413281089, 0.0836794635491854, 0.03665382037533512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39cf26de-0200-4f86-b3ba-d96680b512b1", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68f10202-7861-4468-9a7f-a236d7523419", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 468.45833333333337, 148, 920, 465.5, 803.0, 898.5, 920.0, 0.10218853785233757, 0.06277010772375032, 0.046204387720344034], "isController": false}, {"data": ["login", 24, 5, 20.833333333333332, 1969.7916666666667, 1362, 3226, 1794.5, 2909.0, 3148.0, 3226.0, 0.10409483039048573, 0.1549139130331065, 0.1562947282474334], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 156.66666666666666, 130, 397, 136.0, 319.90000000000026, 397.0, 397.0, 0.06503430559620199, 0.03232662260592462, 0.03264417292621858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59565c58-0395-4488-b748-33eadfe2107f", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 0.6062552432885906, 2.3136010906040267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 175.9333333333333, 131, 402, 142.0, 401.4, 402.0, 402.0, 0.07709268082088286, 0.0624119457036249, 0.027404038885548206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 203.38888888888889, 130, 492, 138.0, 427.2000000000001, 492.0, 492.0, 0.10134564495242385, 0.05037591140701537, 0.05087076318900963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a8e157a-c432-4edf-8585-78d5daa1bcc6", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c4b8de7-12a7-4131-be4f-77b74aecce2a", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72e49ff1-c3ee-4df4-9dcc-9cce758a5c1b", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.18012369142572285, 0.6873909521435694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b825280d-cb80-465b-9e04-a50398046bfb", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3d2bee1-59fe-4033-a422-163462d8bcaa", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5bc3f69-09f5-4489-877a-780f20cf8f64", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 205.64705882352942, 129, 470, 139.0, 433.99999999999994, 470.0, 470.0, 0.12235233153163529, 0.10144250924839682, 0.043492430349135976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72e49ff1-c3ee-4df4-9dcc-9cce758a5c1b", 3, 0, 0.0, 585.3333333333334, 240, 880, 636.0, 880.0, 880.0, 880.0, 0.02596683170030814, 0.026042906402555136, 0.016651907047398124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 150.5, 128, 412, 134.0, 170.80000000000038, 412.0, 412.0, 0.07920582954905481, 0.03937086644577041, 0.039757613660365405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a8e157a-c432-4edf-8585-78d5daa1bcc6", 3, 0, 0.0, 417.66666666666663, 209, 757, 287.0, 757.0, 757.0, 757.0, 0.06589062156819679, 0.029813790358005708, 0.04225407698220953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 167.88888888888889, 128, 401, 139.0, 399.2, 401.0, 401.0, 0.07894771468295914, 0.06129241520796144, 0.02806344545370813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c21f5e81-ba5f-4183-a588-0c9e657e3102", 3, 0, 0.0, 678.6666666666666, 224, 1387, 425.0, 1387.0, 1387.0, 1387.0, 0.02899447172072525, 0.02907941646209456, 0.01859346005528279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59565c58-0395-4488-b748-33eadfe2107f", 3, 0, 0.0, 306.3333333333333, 234, 448, 237.0, 448.0, 448.0, 448.0, 0.0843858119321538, 0.03818238235211386, 0.05411459944867936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5bc3f69-09f5-4489-877a-780f20cf8f64", 3, 0, 0.0, 280.6666666666667, 227, 385, 230.0, 385.0, 385.0, 385.0, 0.08661508257304538, 0.039191069263194364, 0.05554417730107402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8855c83-b713-4765-bed6-0bed9c3b9ca1", 3, 0, 0.0, 511.0, 228, 898, 407.0, 898.0, 898.0, 898.0, 0.01794172527630257, 0.02473411671391321, 0.011505598565858094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 135.7142857142857, 131, 139, 136.0, 139.0, 139.0, 139.0, 0.03794716670190332, 0.018862410011004676, 0.021493512389749926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 156.0666666666667, 131, 410, 138.0, 254.60000000000008, 410.0, 410.0, 0.1090354001599186, 0.05419826043105328, 0.05473065984589664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c21f5e81-ba5f-4183-a588-0c9e657e3102", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.18267347067745196, 0.6971214610717897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9da0627-afdc-4bb5-a0cc-c219ea6a72c1", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3d2bee1-59fe-4033-a422-163462d8bcaa", 3, 0, 0.0, 356.6666666666667, 298, 454, 318.0, 454.0, 454.0, 454.0, 0.02448979591836735, 0.02456154336734694, 0.0157047193877551], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1021.375, 189, 1691, 1034.0, 1567.5, 1676.0, 1691.0, 0.10436733824149733, 0.0330734387298495, 0.047087607683175554], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5641025641025643, 0.8116883116883117], "isController": false}, {"data": ["401/Unauthorized", 12, 6.153846153846154, 1.948051948051948], "isController": false}, {"data": ["404/Not Found", 178, 91.28205128205128, 28.896103896103895], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 616, 195, "404/Not Found", 178, "401/Unauthorized", 12, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, "404/Not Found", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
