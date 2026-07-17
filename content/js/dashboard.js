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

    var data = {"OkPercent": 97.35049205147615, "KoPercent": 2.6495079485238455};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7150747238466537, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be018ec9-b286-46fb-b319-4861f4abedf8"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd628da8-c394-44c0-9697-c7e84f138005"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a2885e8-87ae-4252-8f35-cab71d23db3f"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ac62952-60d6-44f0-ab01-ca71587186f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe37dce6-a680-40b7-81b9-de5c49e97d76"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e7e5c18b-a300-4f3d-901e-d466cb9314e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6304347826086957, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef80bd2e-6c5d-4f08-9804-f8824416a24a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c59ab76c-dc0f-44e0-9d93-75c956d00f29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fc5c253-7eab-438f-9970-d0a862bcfb5c"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=168dc549-1857-4488-947f-d7534d1bb4b7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c214152-d892-493a-a4a2-0701dce38e86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/066d3f3b-2404-4a18-898c-3c3654c2a0af"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea68c6c6-b6e2-4527-9159-efb108d38b93"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7e5c18b-a300-4f3d-901e-d466cb9314e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a2885e8-87ae-4252-8f35-cab71d23db3f"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef80bd2e-6c5d-4f08-9804-f8824416a24a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbf44995-94b5-49d7-8bde-abcfad84b669"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6fc5c253-7eab-438f-9970-d0a862bcfb5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ac62952-60d6-44f0-ab01-ca71587186f2"], "isController": false}, {"data": [0.23728813559322035, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd628da8-c394-44c0-9697-c7e84f138005"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be018ec9-b286-46fb-b319-4861f4abedf8"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8936781609195402, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e7c8946-5a21-421e-957a-523e3fc394b3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/168dc549-1857-4488-947f-d7534d1bb4b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d39e995-883b-4277-808b-ebf022baed2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c214152-d892-493a-a4a2-0701dce38e86"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c59ab76c-dc0f-44e0-9d93-75c956d00f29"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea68c6c6-b6e2-4527-9159-efb108d38b93"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 35, 2.6495079485238455, 487.8251324753977, 135, 2791, 158.0, 1387.9999999999998, 1649.199999999999, 2233.0599999999995, 5.264374412191351, 737.5892321861601, 3.849084207823235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/be018ec9-b286-46fb-b319-4861f4abedf8", 3, 0, 0.0, 654.3333333333334, 245, 1167, 551.0, 1167.0, 1167.0, 1167.0, 0.017704233082129938, 0.02440671455169931, 0.011353300511652337], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2421.107142857142, 1806, 4180, 2373.5, 2866.5000000000005, 3059.65, 4180.0, 0.25251386571673357, 303.8577499351806, 1.241608704964603], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd628da8-c394-44c0-9697-c7e84f138005", 3, 0, 0.0, 376.3333333333333, 283, 448, 398.0, 448.0, 448.0, 448.0, 0.026720820863616927, 0.026799104518490807, 0.017135422233504345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a2885e8-87ae-4252-8f35-cab71d23db3f", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 504.35714285714295, 147, 902, 525.0, 840.0, 902.0, 902.0, 0.08138020833333333, 0.016694977169945127, 0.05447864532470703], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 504.35714285714295, 147, 902, 525.0, 840.0, 902.0, 902.0, 0.0800384184408516, 0.01641971181881589, 0.053580406094925564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ac62952-60d6-44f0-ab01-ca71587186f2", 3, 0, 0.0, 368.0, 284, 475, 345.0, 475.0, 475.0, 475.0, 0.016758278589623275, 0.023102639917660994, 0.010746682559100863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 213.9375, 135, 435, 144.0, 430.1, 435.0, 435.0, 0.0985731536016166, 0.0448825516276892, 0.05518267607629562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 144.68750000000003, 139, 153, 145.0, 150.2, 153.0, 153.0, 0.0985725463136948, 0.07325557396945483, 0.049478797661366335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 318.5625, 141, 1189, 148.0, 1066.5000000000002, 1189.0, 1189.0, 0.09857072449482504, 3.6461301364588468, 0.05698620009857073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 327.875, 136, 1432, 146.5, 1285.0000000000002, 1432.0, 1432.0, 0.0985731536016166, 11.110284587625372, 0.056891341580620515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe37dce6-a680-40b7-81b9-de5c49e97d76", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9176320043103449, 1.7145968031609196], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 249.35714285714286, 144, 357, 249.5, 345.0, 357.0, 357.0, 0.08170173032593155, 0.13811672952350385, 0.0528017948848881], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 145.25, 141, 149, 145.0, 149.0, 149.0, 149.0, 0.0742890307603018, 0.05520893789901335, 0.03728961114335461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 145.5625, 139, 152, 146.5, 149.9, 152.0, 152.0, 0.07428868583314761, 0.0198780272639477, 0.04236776613921699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1015.8571428571429, 811, 1181, 1112.0, 1181.0, 1181.0, 1181.0, 0.04624949621084484, 13.59888751379226, 0.02637666580774745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1496.2857142857142, 1117, 1730, 1484.0, 1730.0, 1730.0, 1730.0, 0.04610449914048041, 41.48490936966917, 0.026248948241113356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 308.42857142857144, 141, 454, 418.0, 454.0, 454.0, 454.0, 0.04656701325829392, 0.08240178517971541, 0.025784664567824855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 208.11111111111111, 137, 431, 148.0, 431.0, 431.0, 431.0, 0.1098766939323648, 0.08165641023684532, 0.055152949884019045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 242.33333333333334, 137, 445, 147.0, 445.0, 445.0, 445.0, 0.10986730471086587, 0.029398087393337158, 0.0626586972179157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 236.55555555555554, 138, 429, 143.0, 429.0, 429.0, 429.0, 0.10949437928852986, 0.029512156917611564, 0.06437071907392088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 241.66666666666666, 141, 442, 148.0, 442.0, 442.0, 442.0, 0.10946907498631638, 0.02950533661740558, 0.06446274630541872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7e5c18b-a300-4f3d-901e-d466cb9314e7", 3, 0, 0.0, 617.0, 333, 760, 758.0, 760.0, 760.0, 760.0, 0.034302179331793546, 0.028596315517162525, 0.02199716578243271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 187.85714285714286, 138, 444, 148.0, 444.0, 444.0, 444.0, 0.04656763283417266, 0.034607391198052145, 0.026148817265282502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 206.50000000000003, 139, 588, 143.5, 487.2000000000001, 588.0, 588.0, 0.0742911003904926, 0.020023773152124957, 0.043675041440504436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1045.1176470588234, 136, 2430, 1275.0, 2033.9999999999995, 2430.0, 2430.0, 0.08691784218787547, 46.01483890480963, 0.04670435982452822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 176.125, 137, 423, 143.0, 418.1, 423.0, 423.0, 0.07429282517040917, 0.020024238034211845, 0.043748607009528054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 746.1764705882352, 139, 1415, 1021.0, 1278.9999999999998, 1415.0, 1415.0, 0.08678960158467602, 15.02082312279197, 0.0467202065975413], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 500.21428571428584, 150, 842, 534.0, 802.5, 842.0, 842.0, 0.0802710869278535, 0.01646744326554249, 0.05411691232963895], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 518.0, 288, 875, 571.0, 875.0, 875.0, 875.0, 0.10928563622454555, 0.1693713912972205, 0.24578595725110197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 687.7826086956521, 222, 1171, 701.0, 1105.2, 1165.1999999999998, 1171.0, 0.10332249195881477, 0.06346664789267038, 0.046717103297784404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 161.52941176470588, 137, 415, 146.0, 214.99999999999983, 415.0, 415.0, 0.08691917539267015, 0.06459520749396679, 0.04362935171077389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 293.4117647058824, 136, 444, 407.0, 440.8, 444.0, 444.0, 0.08679004467134653, 0.09990228142948308, 0.04520979578813018], "isController": false}, {"data": ["login", 23, 0, 0.0, 3300.4782608695655, 1869, 4643, 3446.0, 4334.8, 4584.4, 4643.0, 0.10081926612341155, 36.845387936372084, 0.20299551710420766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 169.1875, 143, 453, 150.0, 246.50000000000023, 453.0, 453.0, 0.07311778818690734, 0.05919399063178339, 0.025991088769564723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef80bd2e-6c5d-4f08-9804-f8824416a24a", 3, 0, 0.0, 905.0, 250, 1428, 1037.0, 1428.0, 1428.0, 1428.0, 0.043482672155146174, 0.027955168459119044, 0.027884395880741528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c59ab76c-dc0f-44e0-9d93-75c956d00f29", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.2367812090432503, 0.9036082896461337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fc5c253-7eab-438f-9970-d0a862bcfb5c", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1226.705882352941, 284, 2596, 1421.0, 2181.5999999999995, 2596.0, 2596.0, 0.08672628673751014, 61.08757413981553, 0.1819966670960468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=168dc549-1857-4488-947f-d7534d1bb4b7", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 529.5625, 287, 1577, 301.0, 1426.5000000000002, 1577.0, 1577.0, 0.09848396250223128, 14.861184258108, 0.21834298424872126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 997.0, 144, 2102, 1265.0, 2012.8, 2102.0, 2102.0, 0.08553925923001507, 55.1138597452246, 0.13001813185547814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c214152-d892-493a-a4a2-0701dce38e86", 3, 0, 0.0, 384.0, 291, 561, 300.0, 561.0, 561.0, 561.0, 0.03032508491023775, 0.024649002936479057, 0.019446750414442826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/066d3f3b-2404-4a18-898c-3c3654c2a0af", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea68c6c6-b6e2-4527-9159-efb108d38b93", 3, 0, 0.0, 358.3333333333333, 243, 583, 249.0, 583.0, 583.0, 583.0, 0.03948771274005239, 0.025386794486199044, 0.025322524120411197], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1175.083333333333, 220, 2624, 1175.5, 2012.0, 2492.25, 2624.0, 0.09586617082552756, 0.03009860734414757, 0.04325212004042357], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7e5c18b-a300-4f3d-901e-d466cb9314e7", 1, 0, 0.0, 842.0, 842, 842, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 0.21456539489311163, 0.8188279394299288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 170.5263157894737, 143, 427, 153.0, 195.0, 427.0, 427.0, 0.09145827817757347, 0.07100520620231533, 0.032510559820934315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 389.81250000000006, 285, 730, 295.5, 629.2, 730.0, 730.0, 0.074237671906609, 0.1150538919099497, 0.16696226406339898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a2885e8-87ae-4252-8f35-cab71d23db3f", 3, 0, 0.0, 331.3333333333333, 238, 517, 239.0, 517.0, 517.0, 517.0, 0.06568432115254089, 0.04222868954305607, 0.04212178146826352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 598.4375, 281, 2692, 295.0, 1779.900000000001, 2692.0, 2692.0, 0.10795638562020944, 8.228939912572196, 0.24107008815313613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 163.6875, 139, 432, 146.0, 237.4000000000002, 432.0, 432.0, 0.08208748473685831, 0.06100446863745037, 0.04120406948705583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 217.9375, 141, 446, 145.5, 444.6, 446.0, 446.0, 0.08208916936021754, 0.02967114629829152, 0.046385591426812374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 321.75, 139, 1540, 148.0, 774.2000000000007, 1540.0, 1540.0, 0.08208959052686125, 4.637265218961156, 0.04781878979421166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 206.3125, 137, 867, 144.0, 556.9000000000003, 867.0, 867.0, 0.08209211761748152, 1.529356510033196, 0.047900429957466024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 152.66666666666666, 150, 158, 150.0, 158.0, 158.0, 158.0, 0.10249752297652807, 0.03022876165909324, 0.06336028519935769], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1648.3035714285718, 1099, 2483, 1596.5, 2195.6000000000004, 2390.5, 2483.0, 0.25772958643606003, 308.3341866790622, 0.508915257591517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1175.083333333333, 220, 2624, 1175.5, 2012.0, 2492.25, 2624.0, 0.09664870611544688, 0.030344295914175947, 0.043605177954430134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 194.33333333333334, 137, 448, 147.0, 448.0, 448.0, 448.0, 0.0690965624460183, 0.018623682846778376, 0.040688698393504925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 140.83333333333334, 138, 146, 139.0, 146.0, 146.0, 146.0, 0.0690965624460183, 0.018623682846778376, 0.040621221281741234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef80bd2e-6c5d-4f08-9804-f8824416a24a", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbf44995-94b5-49d7-8bde-abcfad84b669", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 174.26315789473685, 139, 412, 148.0, 411.0, 412.0, 412.0, 0.0940673224974379, 0.02535408301688756, 0.05530129701509533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 202.94736842105263, 136, 445, 145.0, 439.0, 445.0, 445.0, 0.09392874268962484, 0.02531673142806294, 0.055311554533050554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fc5c253-7eab-438f-9970-d0a862bcfb5c", 3, 0, 0.0, 525.3333333333334, 357, 674, 545.0, 674.0, 674.0, 674.0, 0.035386538960579396, 0.029500301522800726, 0.022692539632923635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 175.68421052631578, 137, 438, 148.0, 413.0, 438.0, 438.0, 0.09406778821875217, 0.0699077996430375, 0.04721762025824083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 141.0, 136, 146, 140.5, 146.0, 146.0, 146.0, 0.06909815392765423, 0.018489154468923106, 0.0394075409118653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 175.1052631578947, 138, 443, 145.0, 436.0, 443.0, 443.0, 0.09393385079349384, 0.025134643669352846, 0.053571649280664456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 141.66666666666666, 137, 146, 140.5, 146.0, 146.0, 146.0, 0.06909497103769131, 0.05134889937469051, 0.03468243663415364], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 520.2857142857143, 149, 1037, 502.5, 898.5, 1037.0, 1037.0, 0.08158365529740155, 0.016258684652948958, 0.05551398977581977], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 201.83333333333331, 146, 438, 155.0, 438.0, 438.0, 438.0, 0.07263746640517178, 0.05717363078375826, 0.025820349386213408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1643.3913043478258, 1115, 2791, 1547.0, 2324.8, 2712.799999999999, 2791.0, 0.1028135141659142, 0.05321402588665481, 0.04729020036342342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 338.33333333333337, 276, 596, 290.0, 596.0, 596.0, 596.0, 0.06898454746136866, 0.10691257502069537, 0.15514786406594924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ac62952-60d6-44f0-ab01-ca71587186f2", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["addBook", 59, 16, 27.11864406779661, 1363.3728813559323, 727, 3293, 1122.0, 2354.0, 2955.0, 3293.0, 0.29629480831232485, 85.26057209850798, 1.0775408849170875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd628da8-c394-44c0-9697-c7e84f138005", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be018ec9-b286-46fb-b319-4861f4abedf8", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 240.39285714285722, 140, 605, 150.0, 576.8000000000001, 583.45, 605.0, 0.25924245650744854, 0.19265967715055504, 0.12531739840936235], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 918.2857142857143, 676, 1500, 858.0, 1189.5, 1286.8, 1500.0, 0.2585983966899405, 76.03651490173262, 0.13005681083527282], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 228.62499999999997, 138, 553, 150.5, 429.3, 436.05, 553.0, 0.25951877803729656, 0.4592265876988099, 0.12621128072516963], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1402.8928571428576, 948, 1909, 1393.0, 1765.2000000000003, 1879.8, 1909.0, 0.258493353028065, 232.59277343750003, 0.12975154634416544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 171.0, 142, 434, 150.5, 257.6000000000002, 434.0, 434.0, 0.11141828513331895, 0.08323729309276268, 0.039605718543484464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 16, 9.195402298850574, 208.68965517241386, 140, 1297, 152.0, 372.0, 468.0, 805.75, 0.7492023578345468, 1.605396981715587, 0.35912314663913847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 169.5, 145, 411, 152.0, 240.90000000000018, 411.0, 411.0, 0.0788865168151541, 0.061090827963298046, 0.028041691524136807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 173.37500000000003, 143, 463, 148.5, 283.8000000000002, 463.0, 463.0, 0.10442500978984466, 0.08474334290562589, 0.03711982769873385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 489.75000000000006, 286, 1686, 300.5, 1111.3000000000006, 1686.0, 1686.0, 0.08202562275390776, 6.2523760596044315, 0.1831658590133343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 398.7368421052631, 283, 883, 299.0, 857.0, 883.0, 883.0, 0.09386099680378605, 0.14546621281993016, 0.21109558167882744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e7c8946-5a21-421e-957a-523e3fc394b3", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/168dc549-1857-4488-947f-d7534d1bb4b7", 3, 0, 0.0, 999.6666666666666, 249, 2262, 488.0, 2262.0, 2262.0, 2262.0, 0.037406017381329405, 0.024048464950561715, 0.023987582760813458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d39e995-883b-4277-808b-ebf022baed2f", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 182.44444444444446, 146, 425, 153.0, 425.0, 425.0, 425.0, 0.10416666666666667, 0.08636474609375, 0.037027994791666664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 184.64705882352942, 138, 442, 152.0, 418.0, 442.0, 442.0, 0.08672628673751014, 0.0673314433167193, 0.030828484738724307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c214152-d892-493a-a4a2-0701dce38e86", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c59ab76c-dc0f-44e0-9d93-75c956d00f29", 3, 0, 0.0, 648.3333333333334, 266, 1213, 466.0, 1213.0, 1213.0, 1213.0, 0.07263746640517178, 0.04669889197598121, 0.04658066693300404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea68c6c6-b6e2-4527-9159-efb108d38b93", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 292.18749999999994, 138, 2248, 145.0, 967.7000000000013, 2248.0, 2248.0, 0.1080613788631943, 0.08030733331532311, 0.05424174681218932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 197.4375, 136, 443, 143.5, 442.3, 443.0, 443.0, 0.1080613788631943, 0.03905880649583964, 0.06106153842257402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 265.81250000000006, 139, 1218, 146.5, 671.3000000000005, 1218.0, 1218.0, 0.10806283854061136, 6.104501672019154, 0.06294871405222136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 284.5625, 138, 1249, 143.5, 684.8000000000006, 1249.0, 1249.0, 0.10806283854061136, 2.013184827133228, 0.06305424416798368], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.0, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.22710068130204392], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.22710068130204392], "isController": false}, {"data": ["401/Unauthorized", 22, 62.857142857142854, 1.6654049962149886], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 35, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
