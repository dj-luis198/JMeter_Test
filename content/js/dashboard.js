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

    var data = {"OkPercent": 98.34024896265561, "KoPercent": 1.6597510373443984};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7817857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36538461538461536, 500, 1500, "see books"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=167734d6-bee3-49e7-91ce-31ba51cfb250"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ea07bb4-2979-4d27-8853-1b1eb35580d7"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1880614c-dae9-455c-b727-c97094911066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23002378-f810-4df2-a16b-49209947f7db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13964479-f15a-47fb-8e28-c97822968554"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/11ec388e-1f24-4a99-acc1-298d25255bb0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/33d185f9-b38d-4e22-a6d3-2c5d1c86658c"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe66275a-614d-446a-848d-c09df956b68c"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eabb8510-eead-475b-a047-5a01f6181b2e"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db9ba24c-58c7-431a-bf9b-fcd8a38b1e3d"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/167734d6-bee3-49e7-91ce-31ba51cfb250"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eabb8510-eead-475b-a047-5a01f6181b2e"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ea07bb4-2979-4d27-8853-1b1eb35580d7"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fe14483-d754-42f7-ad85-df0b9de2df50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a31e388c-327b-4039-89f7-716acdf4f8d0"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1880614c-dae9-455c-b727-c97094911066"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be3f22be-7a1d-4a2e-829a-5a9e4307edbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11ec388e-1f24-4a99-acc1-298d25255bb0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fad955b6-7efc-46b1-9afd-78bd9d1a1d23"], "isController": false}, {"data": [0.7884615384615384, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/13964479-f15a-47fb-8e28-c97822968554"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33d185f9-b38d-4e22-a6d3-2c5d1c86658c"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/495fdf15-5084-45e4-b87d-d55bb2d90bd0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be3f22be-7a1d-4a2e-829a-5a9e4307edbe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3fe14483-d754-42f7-ad85-df0b9de2df50"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe66275a-614d-446a-848d-c09df956b68c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db9ba24c-58c7-431a-bf9b-fcd8a38b1e3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1205, 20, 1.6597510373443984, 485.5502074688793, 81, 12059, 102.0, 968.4000000000001, 1225.0, 7544.840000000037, 4.7085210554902135, 666.8629466256901, 3.4417284802515637], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2499.692307692308, 1037, 15615, 1365.0, 6598.9000000000015, 13415.749999999993, 15615.0, 0.2306160553123739, 277.50833592499214, 1.1339373422830101], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 557.1666666666667, 93, 778, 595.0, 760.0000000000001, 778.0, 778.0, 0.08614810294698302, 0.016384124071215766, 0.058210261944075525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 557.1666666666667, 93, 778, 595.0, 760.0000000000001, 778.0, 778.0, 0.08909810443782809, 0.0169451717180342, 0.06020357756732476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 113.20000000000002, 82, 249, 84.0, 248.4, 249.0, 249.0, 0.07551729346020239, 0.02776833811609525, 0.0426456382469919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 96.13333333333334, 82, 250, 85.0, 155.20000000000005, 250.0, 250.0, 0.0755157727277304, 0.05612060844316683, 0.03790537810747405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 190.26666666666665, 82, 836, 86.0, 492.8000000000002, 836.0, 836.0, 0.07551653308631036, 1.4992883353387167, 0.04403656164414596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=167734d6-bee3-49e7-91ce-31ba51cfb250", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 183.5333333333333, 82, 921, 85.0, 531.6000000000003, 921.0, 921.0, 0.07551729346020239, 4.549036879184917, 0.04396325769017772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ea07bb4-2979-4d27-8853-1b1eb35580d7", 3, 0, 0.0, 568.0, 201, 1029, 474.0, 1029.0, 1029.0, 1029.0, 0.027884669008978864, 0.027966362375216106, 0.017881770165263138], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 281.25, 85, 1029, 206.5, 809.1000000000008, 1029.0, 1029.0, 0.08615119534783545, 0.17662817906884917, 0.05568839067772274], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1880614c-dae9-455c-b727-c97094911066", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.5409103667664671, 2.0642309131736525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23002378-f810-4df2-a16b-49209947f7db", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 84.75, 83, 88, 84.5, 87.3, 88.0, 88.0, 0.12174984971502925, 0.0904801129229856, 0.061112717532739294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 105.99999999999999, 81, 271, 83.5, 263.3, 271.0, 271.0, 0.12158701450685067, 0.0325340253660909, 0.06934259421093827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 557.8, 489, 664, 544.0, 664.0, 664.0, 664.0, 0.05324643515116663, 15.656219882485116, 0.030367107547149715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 873.4, 723, 986, 907.0, 986.0, 986.0, 986.0, 0.05307461228995722, 47.75662943372043, 0.030217284145551818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 188.6, 84, 279, 246.0, 279.0, 279.0, 279.0, 0.05354236271738199, 0.09474488402724235, 0.02964699185620663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 109.78571428571429, 84, 260, 84.5, 254.0, 260.0, 260.0, 0.06607482501970445, 0.049104435390620205, 0.033166464902468835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13964479-f15a-47fb-8e28-c97822968554", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 123.28571428571428, 82, 275, 84.0, 271.5, 275.0, 275.0, 0.06607544872309194, 0.03185780563434791, 0.036890896455052176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 214.35714285714286, 82, 894, 85.5, 811.0, 894.0, 894.0, 0.06607607243825427, 8.508889075383358, 0.038034301741104504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 205.64285714285714, 81, 683, 85.5, 670.5, 683.0, 683.0, 0.06607576057920124, 2.790760632297832, 0.038098649340658305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 121.6, 83, 248, 90.0, 248.0, 248.0, 248.0, 0.05354178936660063, 0.03979033369920223, 0.030064969615034534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 850.8333333333333, 86, 1139, 973.5, 1119.2, 1139.0, 1139.0, 0.07820493603487941, 58.64429554052644, 0.040375334814882397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 105.9375, 82, 264, 84.0, 254.9, 264.0, 264.0, 0.12174336498660823, 0.03281364134404675, 0.07157178293158023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 543.0833333333334, 83, 729, 647.5, 714.9000000000001, 729.0, 729.0, 0.07820136852394917, 19.165012015314435, 0.04044986151840991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 171.87500000000006, 81, 279, 167.5, 272.7, 279.0, 279.0, 0.12159533073929961, 0.032773741488326846, 0.07160350042558365], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 625.8333333333334, 85, 1601, 515.5, 1426.1000000000006, 1601.0, 1601.0, 0.08939279941000752, 0.017001218442479458, 0.06110108416704534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/11ec388e-1f24-4a99-acc1-298d25255bb0", 3, 0, 0.0, 3660.666666666667, 277, 9878, 827.0, 9878.0, 9878.0, 9878.0, 0.01971271996110023, 0.023299767636313456, 0.012641295027137844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 350.5, 168, 979, 178.5, 896.0, 979.0, 979.0, 0.06604832850551504, 11.375847865931329, 0.14613008395214327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33d185f9-b38d-4e22-a6d3-2c5d1c86658c", 3, 0, 0.0, 1373.6666666666667, 194, 3409, 518.0, 3409.0, 3409.0, 3409.0, 0.019946278024520623, 0.023575825360362755, 0.012791070217547405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1318.45, 187, 5999, 690.5, 4857.300000000003, 5947.849999999999, 5999.0, 0.09256430905371506, 0.05685834999490896, 0.041852807706904374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 90.75000000000001, 83, 149, 84.5, 131.60000000000008, 149.0, 149.0, 0.07821716997242845, 0.058128189793962934, 0.03926135289631662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 116.25, 83, 270, 84.5, 265.20000000000005, 270.0, 270.0, 0.07820289741734932, 0.11880628979387019, 0.03912690538101103], "isController": false}, {"data": ["login", 20, 0, 0.0, 6838.999999999999, 1659, 21578, 3645.5, 20575.80000000001, 21556.9, 21578.0, 0.09288975379570756, 27.909493049814454, 0.17865856455141216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 112.9375, 83, 275, 88.5, 267.3, 275.0, 275.0, 0.12061725882202169, 0.09764815191743748, 0.04287566622189052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe66275a-614d-446a-848d-c09df956b68c", 1, 0, 0.0, 1018.0, 1018, 1018, 1018.0, 1018.0, 1018.0, 1018.0, 0.9823182711198427, 0.17746960952848723, 0.6772624017681729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 943.1666666666666, 205, 1224, 1060.5, 1206.3, 1224.0, 1224.0, 0.07815807470609307, 77.94037953479663, 0.15911477838929236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 314.00000000000006, 168, 1003, 315.0, 701.2000000000002, 1003.0, 1003.0, 0.07548347163582747, 6.129483954101017, 0.16847655326113758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eabb8510-eead-475b-a047-5a01f6181b2e", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 735.4285714285714, 84, 1155, 901.0, 1155.0, 1155.0, 1155.0, 0.06955899596557824, 59.445847700578334, 0.12520231109764096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db9ba24c-58c7-431a-bf9b-fcd8a38b1e3d", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 3762.2380952380963, 266, 12059, 1936.0, 10270.6, 11894.099999999999, 12059.0, 0.08670054869061529, 0.027384213481522462, 0.039116849116273694], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/167734d6-bee3-49e7-91ce-31ba51cfb250", 3, 0, 0.0, 1199.6666666666667, 204, 2851, 544.0, 2851.0, 2851.0, 2851.0, 0.02855266539131428, 0.028636315778202893, 0.018310140241174847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eabb8510-eead-475b-a047-5a01f6181b2e", 3, 0, 0.0, 545.6666666666667, 202, 1059, 376.0, 1059.0, 1059.0, 1059.0, 0.06856515975682224, 0.031023949238926728, 0.04396919424509759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 556.6874999999999, 85, 7586, 87.0, 2347.2000000000053, 7586.0, 7586.0, 0.076732720750446, 0.05957276659824666, 0.027276084329260104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 281.5625, 167, 365, 339.5, 360.8, 365.0, 365.0, 0.12150852837983565, 0.18831448685429608, 0.2732755281823843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ea07bb4-2979-4d27-8853-1b1eb35580d7", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 268.9090909090909, 167, 540, 178.0, 517.9, 538.35, 540.0, 0.11457139881262368, 0.1775632909332361, 0.25767376119675034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fe14483-d754-42f7-ad85-df0b9de2df50", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 85.0, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.028573061317789587, 0.021234472326990113, 0.014342337419281101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 82.8, 82, 84, 82.0, 84.0, 84.0, 84.0, 0.028573387889455275, 0.00764561355635815, 0.016295760280704962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 115.2, 82, 245, 83.0, 245.0, 245.0, 245.0, 0.02857371446858606, 0.0077015089778610865, 0.016798218857508602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 118.6, 83, 253, 84.0, 253.0, 253.0, 253.0, 0.028573551178087516, 0.007701464965968901, 0.016826026719127706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 3.4696691176470584, 7.27251838235294], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 956.3653846153849, 655, 1480, 904.0, 1325.7, 1450.05, 1480.0, 0.23012107909084473, 275.304813624053, 0.4543992401578985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a31e388c-327b-4039-89f7-716acdf4f8d0", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 3762.2380952380963, 266, 12059, 1936.0, 10270.6, 11894.099999999999, 12059.0, 0.0848903297787192, 0.026812459070733857, 0.03830012925563308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 83.66666666666666, 83, 84, 84.0, 84.0, 84.0, 84.0, 0.04033342296316214, 0.010871117908039796, 0.02375102934256521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 112.16666666666666, 82, 255, 83.5, 255.0, 255.0, 255.0, 0.04028684231729917, 0.010858562968334543, 0.02368425690919346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1880614c-dae9-455c-b727-c97094911066", 3, 0, 0.0, 334.6666666666667, 177, 531, 296.0, 531.0, 531.0, 531.0, 0.10172595028991896, 0.04781649486283951, 0.06523441473669933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 156.0625, 82, 731, 85.0, 396.4000000000003, 731.0, 731.0, 0.07782063316812661, 4.396110556672876, 0.04533203875467532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 159.0, 81, 761, 84.5, 413.80000000000035, 761.0, 761.0, 0.07780927972922372, 1.4495682648773773, 0.04540141077950309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 108.62499999999999, 82, 273, 84.0, 266.0, 273.0, 273.0, 0.0780659169085897, 0.05801578395257495, 0.03918543094825693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be3f22be-7a1d-4a2e-829a-5a9e4307edbe", 3, 0, 0.0, 519.3333333333334, 178, 910, 470.0, 910.0, 910.0, 910.0, 0.022929468953499035, 0.02299664513207374, 0.014704119088018587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 83.33333333333334, 82, 85, 83.5, 85.0, 85.0, 85.0, 0.04033342296316214, 0.01079234169131487, 0.02300265528367841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 105.25000000000001, 82, 262, 84.0, 252.9, 262.0, 262.0, 0.07799817679261747, 0.02819245623571049, 0.04407392094397293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 85.0, 84, 86, 85.0, 86.0, 86.0, 86.0, 0.040332609587061294, 0.02997374599194692, 0.02024507942163038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 120.83333333333334, 85, 265, 95.0, 265.0, 265.0, 265.0, 0.04149894177698469, 0.03266420612524381, 0.014751576959787526], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 673.4166666666666, 84, 1225, 537.5, 1201.6000000000001, 1225.0, 1225.0, 0.0887121217721725, 0.016669619887039896, 0.06037593378749011], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 3695.049999999999, 1083, 10441, 2284.0, 8172.700000000001, 10328.8, 10441.0, 0.0927243814124705, 0.04799211147325133, 0.0426495934035875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 198.66666666666666, 168, 342, 170.0, 342.0, 342.0, 342.0, 0.040263322126708675, 0.06240028536629557, 0.09055315513458015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11ec388e-1f24-4a99-acc1-298d25255bb0", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["addBook", 54, 11, 20.37037037037037, 954.5185185185185, 427, 2742, 799.5, 1605.0, 1778.25, 2742.0, 0.29041470143755277, 91.20635565347341, 1.0550431655740262], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 151.13461538461542, 82, 458, 85.0, 342.1, 353.44999999999993, 458.0, 0.23095816548152556, 0.1716398085267978, 0.11164481632163589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fad955b6-7efc-46b1-9afd-78bd9d1a1d23", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 554.3076923076923, 401, 804, 491.0, 746.0, 781.05, 804.0, 0.2309222680119369, 67.89881413643954, 0.11613766408803468], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 133.21153846153842, 81, 387, 86.0, 268.8, 289.0, 387.0, 0.23125500311304814, 0.4092129547273859, 0.11246581206083785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13964479-f15a-47fb-8e28-c97822968554", 3, 0, 0.0, 838.0, 209, 1158, 1147.0, 1158.0, 1158.0, 1158.0, 0.045224994346875706, 0.029075313748398283, 0.02900170535916183], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 799.75, 566, 1138, 810.5, 983.4000000000001, 1080.6, 1138.0, 0.23050973681994086, 207.41306638347956, 0.11570508273969689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 98.95454545454545, 85, 268, 88.0, 108.4, 244.14999999999966, 268.0, 0.11679948183502604, 0.08725742539433098, 0.04151856580854441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 11, 6.875, 379.4937500000002, 83, 5924, 91.0, 340.00000000000006, 1835.449999999995, 5528.719999999991, 0.6709889538443473, 1.4568167825345768, 0.3215947179539869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 89.8, 85, 102, 85.0, 102.0, 102.0, 102.0, 0.029177827185565147, 0.022595719685696444, 0.01037180575736886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 691.2666666666667, 83, 9094, 88.0, 3708.4000000000033, 9094.0, 9094.0, 0.07178991399568303, 0.058259197783606054, 0.025519070990652953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 204.4, 169, 337, 172.0, 337.0, 337.0, 337.0, 0.028559352045420795, 0.044261417671955856, 0.06423065210996493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33d185f9-b38d-4e22-a6d3-2c5d1c86658c", 1, 0, 0.0, 1601.0, 1601, 1601, 1601.0, 1601.0, 1601.0, 1601.0, 0.6246096189881324, 0.11284451124297315, 0.43063905371642724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 280.0625, 167, 846, 175.0, 624.1000000000003, 846.0, 846.0, 0.07777675155675029, 5.928507252985898, 0.17367799270356848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/495fdf15-5084-45e4-b87d-d55bb2d90bd0", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be3f22be-7a1d-4a2e-829a-5a9e4307edbe", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fe14483-d754-42f7-ad85-df0b9de2df50", 3, 0, 0.0, 3971.0, 215, 10889, 809.0, 10889.0, 10889.0, 10889.0, 0.018277191892237678, 0.021603022057524415, 0.01172072526943627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 538.4999999999999, 84, 6024, 88.0, 3150.5, 6024.0, 6024.0, 0.06799747437952304, 0.05637681225411628, 0.024170977220846084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 87.83333333333333, 84, 95, 86.5, 93.80000000000001, 95.0, 95.0, 0.0792382562301079, 0.061517982131773216, 0.028166723894296166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe66275a-614d-446a-848d-c09df956b68c", 3, 0, 0.0, 343.0, 283, 393, 353.0, 393.0, 393.0, 393.0, 0.044416149712035294, 0.02855530458374665, 0.02848301267340805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 108.95454545454545, 82, 270, 85.0, 256.5, 268.65, 270.0, 0.11462213770286815, 0.08518305350769792, 0.057534940214134994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 123.90909090909093, 82, 274, 83.0, 263.8, 273.09999999999997, 274.0, 0.11462751268718151, 0.030671814918249746, 0.06537350332940821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 125.36363636363636, 82, 290, 84.0, 268.7, 286.84999999999997, 290.0, 0.1146269154418086, 0.030895535802674977, 0.06738808896090702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db9ba24c-58c7-431a-bf9b-fcd8a38b1e3d", 3, 0, 0.0, 592.3333333333333, 203, 1225, 349.0, 1225.0, 1225.0, 1225.0, 0.024413466468103807, 0.02885589086773598, 0.015655771140027506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 140.0909090909091, 81, 296, 84.0, 267.5, 291.94999999999993, 296.0, 0.11462631820265932, 0.030895374828060523, 0.06749967761348005], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.4149377593360996], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.08298755186721991], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.08298755186721991], "isController": false}, {"data": ["401/Unauthorized", 13, 65.0, 1.0788381742738589], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1205, 20, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
