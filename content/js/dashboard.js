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

    var data = {"OkPercent": 97.22001588562351, "KoPercent": 2.7799841143764894};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7484787018255578, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9407738-787b-45ff-afc4-7d3b6c9e3d2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1a06039-5b60-4a1a-a9f6-9e05228dec7b"], "isController": false}, {"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c296f96c-4275-41e1-bc87-9e4cd573ba19"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59e7a9b4-d833-46b7-9aac-fd44e92d0c4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/f78d6fd6-a978-473b-85f2-32634281ad7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5f97204-2b62-4dca-89f6-01cc6f58a37f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=994f75bf-640a-4a11-bebf-81cb0ab7c503"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b88e956-48b4-4bae-8705-60d9fb2579b2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1096c77-ffdf-472a-a4a1-e7a2fa29ad63"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e575ce86-66ad-4c12-b718-71eec1fea32a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a195605b-f655-47cf-b1da-5a9d004963d5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfc4c23c-5984-4b1b-9f11-9790aa7e979c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c99bb21-dc14-4f3f-b66f-c142241842d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1a06039-5b60-4a1a-a9f6-9e05228dec7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/994f75bf-640a-4a11-bebf-81cb0ab7c503"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9407738-787b-45ff-afc4-7d3b6c9e3d2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c296f96c-4275-41e1-bc87-9e4cd573ba19"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6272727272727273, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8741935483870967, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f5c6c7de-4605-4c48-b1f4-c832f91d8762"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f78d6fd6-a978-473b-85f2-32634281ad7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dfc4c23c-5984-4b1b-9f11-9790aa7e979c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c99bb21-dc14-4f3f-b66f-c142241842d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5f97204-2b62-4dca-89f6-01cc6f58a37f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b88e956-48b4-4bae-8705-60d9fb2579b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1096c77-ffdf-472a-a4a1-e7a2fa29ad63"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e575ce86-66ad-4c12-b718-71eec1fea32a"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/59e7a9b4-d833-46b7-9aac-fd44e92d0c4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a195605b-f655-47cf-b1da-5a9d004963d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ec43a47-5f3d-4cab-a5d5-cb171bff0b51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1259, 35, 2.7799841143764894, 397.972994440032, 93, 6017, 119.0, 1071.0, 1339.0, 2106.600000000007, 4.982152891548148, 741.7723231686928, 3.6373090574570046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9407738-787b-45ff-afc4-7d3b6c9e3d2b", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1a06039-5b60-4a1a-a9f6-9e05228dec7b", 3, 0, 0.0, 394.0, 321, 437, 424.0, 437.0, 437.0, 437.0, 0.08794559099437148, 0.03979308967518762, 0.05639740047490619], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1664.3999999999999, 1248, 2190, 1629.0, 2011.8, 2143.6, 2190.0, 0.234311762450475, 281.9557684959848, 1.1521091054083414], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c296f96c-4275-41e1-bc87-9e4cd573ba19", 3, 0, 0.0, 320.0, 242, 428, 290.0, 428.0, 428.0, 428.0, 0.02101649795089145, 0.024840789081929313, 0.01347737661564328], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 665.6875, 99, 2257, 574.5, 1615.1000000000006, 2257.0, 2257.0, 0.0992445012343535, 0.020056063451351587, 0.0665648085976752], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 665.6875, 99, 2257, 574.5, 1615.1000000000006, 2257.0, 2257.0, 0.09916761185796719, 0.02004052507700985, 0.06651323771406259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 120.27777777777777, 95, 295, 98.0, 292.3, 295.0, 295.0, 0.10672801551113825, 0.028558082275441293, 0.06086832134619604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 101.3888888888889, 97, 116, 99.5, 107.9, 116.0, 116.0, 0.10672358591248667, 0.07931313367129136, 0.05357023745997866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 136.66666666666669, 95, 391, 99.0, 304.60000000000014, 391.0, 391.0, 0.10672674987400314, 0.02876619430197741, 0.06284788102932021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 109.83333333333334, 95, 291, 99.0, 123.60000000000026, 291.0, 291.0, 0.10672738268881853, 0.02876636486534562, 0.0627440277135437], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 665.2941176470588, 96, 3787, 249.0, 3469.3999999999996, 3787.0, 3787.0, 0.08452496967045205, 0.1250297546538454, 0.05462950561593843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59e7a9b4-d833-46b7-9aac-fd44e92d0c4f", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 100.31578947368422, 95, 113, 100.0, 107.0, 113.0, 113.0, 0.1011386078004482, 0.07516257864857528, 0.050766840243584355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 159.10526315789474, 95, 296, 99.0, 293.0, 296.0, 296.0, 0.10114399178071982, 0.05105026723307302, 0.05634244361222458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 703.7777777777778, 496, 819, 766.0, 819.0, 819.0, 819.0, 0.062021486999607196, 18.23637648507005, 0.035371629304463484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1015.0, 844, 1157, 1036.0, 1157.0, 1157.0, 1157.0, 0.06199414499741691, 55.782440642758736, 0.03529549466161529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 170.77777777777777, 95, 301, 99.0, 301.0, 301.0, 301.0, 0.06222947464494628, 0.11011700005531508, 0.03445714074578568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f78d6fd6-a978-473b-85f2-32634281ad7f", 3, 0, 0.0, 2509.6666666666665, 465, 3787, 3277.0, 3787.0, 3787.0, 3787.0, 0.06424670735624799, 0.029069961987364813, 0.04119987418353143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5f97204-2b62-4dca-89f6-01cc6f58a37f", 3, 0, 0.0, 359.6666666666667, 212, 475, 392.0, 475.0, 475.0, 475.0, 0.032810551873482516, 0.02735280707942341, 0.0210406208303257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 100.33333333333333, 95, 114, 98.0, 114.0, 114.0, 114.0, 0.04132933510284116, 0.030714476575451292, 0.020745388909043316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 139.77777777777777, 94, 295, 98.0, 295.0, 295.0, 295.0, 0.041330853482124404, 0.01795667722899589, 0.02318581949897821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 245.77777777777777, 95, 954, 99.0, 954.0, 954.0, 954.0, 0.04132990448199853, 4.141982034407146, 0.023902820191954447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 183.66666666666666, 94, 877, 97.0, 877.0, 877.0, 877.0, 0.041330853482124404, 1.3601958766733255, 0.023943731200202063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 169.44444444444443, 98, 296, 106.0, 296.0, 296.0, 296.0, 0.06231306081754735, 0.04630882742397807, 0.034990244111415755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=994f75bf-640a-4a11-bebf-81cb0ab7c503", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b88e956-48b4-4bae-8705-60d9fb2579b2", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 728.5333333333335, 96, 1264, 950.0, 1190.2, 1264.0, 1264.0, 0.08255320554097116, 49.52842986210863, 0.04380264486711686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 250.94736842105266, 95, 1156, 98.0, 930.0, 1156.0, 1156.0, 0.10114453021027416, 14.392961263973916, 0.05808948296513176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 537.1999999999999, 96, 844, 748.0, 806.2, 844.0, 844.0, 0.08255320554097116, 16.18967252519249, 0.04388326323190296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 237.57894736842104, 97, 876, 101.0, 774.0, 876.0, 876.0, 0.10114506864556105, 4.718748086894261, 0.058188566681217364], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 368.5, 101, 715, 370.0, 612.8000000000001, 715.0, 715.0, 0.10023806540533768, 0.0202568502537276, 0.06776959536712192], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1096c77-ffdf-472a-a4a1-e7a2fa29ad63", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 347.8888888888889, 194, 1053, 203.0, 1053.0, 1053.0, 1053.0, 0.04131036477052093, 5.548193560861643, 0.09173357367933059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e575ce86-66ad-4c12-b718-71eec1fea32a", 3, 0, 0.0, 1742.0, 589, 3390, 1247.0, 3390.0, 3390.0, 3390.0, 0.07693491306354824, 0.03481104464789455, 0.04933651651536134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a195605b-f655-47cf-b1da-5a9d004963d5", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 753.4583333333333, 278, 1986, 564.0, 1663.5, 1938.25, 1986.0, 0.11208092242599157, 0.06884658223237178, 0.050677213948470794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 102.73333333333332, 98, 123, 100.0, 118.8, 123.0, 123.0, 0.08255138823917889, 0.0613492250488429, 0.04143692729974409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 202.13333333333335, 98, 301, 281.0, 298.6, 301.0, 301.0, 0.08255229688007353, 0.10474897566358288, 0.04245853810889198], "isController": false}, {"data": ["login", 24, 0, 0.0, 3469.0000000000005, 2124, 6621, 3210.5, 5108.0, 6427.25, 6621.0, 0.11112963271656387, 50.00408868057871, 0.23677448845640942], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 124.89473684210526, 97, 297, 102.0, 292.0, 297.0, 297.0, 0.10223243350856331, 0.08276434314316307, 0.03634043534874711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 844.8000000000001, 199, 1389, 1050.0, 1300.8, 1389.0, 1389.0, 0.08250643550196915, 65.84687677904502, 0.1714855438411696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfc4c23c-5984-4b1b-9f11-9790aa7e979c", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c99bb21-dc14-4f3f-b66f-c142241842d5", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1a06039-5b60-4a1a-a9f6-9e05228dec7b", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 261.27777777777777, 195, 491, 201.5, 409.10000000000014, 491.0, 491.0, 0.106660978081169, 0.1653036838035305, 0.2398830395712229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 750.5333333333333, 96, 1408, 1053.0, 1345.0, 1408.0, 1408.0, 0.10325103078945738, 74.12552830110755, 0.1670569412226299], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 1314.1153846153848, 268, 3952, 1222.5, 2541.5000000000005, 3613.8999999999987, 3952.0, 0.10993750475691126, 0.03430591907753977, 0.04960071015399708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 105.46153846153845, 100, 141, 102.0, 130.6, 141.0, 141.0, 0.06272829480368457, 0.04870018981340745, 0.02229794854349725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 405.94736842105266, 194, 1256, 235.0, 1027.0, 1256.0, 1256.0, 0.10108533730580975, 19.226643135507555, 0.22325956154234944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 273.68749999999994, 196, 584, 203.5, 581.9, 584.0, 584.0, 0.0749337304821049, 0.1161326467530278, 0.16852771611356207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/994f75bf-640a-4a11-bebf-81cb0ab7c503", 3, 0, 0.0, 355.0, 235, 493, 337.0, 493.0, 493.0, 493.0, 0.06376873206504412, 0.028853690615368265, 0.040893360080773725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 118.09999999999998, 95, 294, 99.0, 274.70000000000005, 294.0, 294.0, 0.05031649072667076, 0.03739340765917622, 0.02525651975928591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 97.8, 95, 102, 97.5, 101.8, 102.0, 102.0, 0.050317503446748985, 0.013463863226962131, 0.02869670118447403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 153.7, 93, 291, 99.0, 290.2, 291.0, 291.0, 0.050316743902868555, 0.01356193488007004, 0.029580742021022333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 118.0, 97, 292, 98.5, 273.00000000000006, 292.0, 292.0, 0.05031699708161417, 0.013562003119653818, 0.029630028554895844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 104.0, 101, 108, 103.0, 108.0, 108.0, 108.0, 0.07439738121218133, 0.02194141516218629, 0.04598978740948319], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1160.2, 769, 1753, 1133.0, 1560.0, 1718.9999999999998, 1753.0, 0.24527401567077986, 293.43299378676323, 0.4843203707874188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 1314.1153846153848, 268, 3952, 1222.5, 2541.5000000000005, 3613.8999999999987, 3952.0, 0.10873747427940512, 0.03393145043244057, 0.04905929015340348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 97.4, 96, 100, 97.0, 100.0, 100.0, 100.0, 0.026043701330833138, 0.007019591374326119, 0.015336281154777715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 176.8, 97, 295, 100.0, 295.0, 295.0, 295.0, 0.026016733963285184, 0.00701232282604171, 0.015294993990134455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9407738-787b-45ff-afc4-7d3b6c9e3d2b", 3, 0, 0.0, 371.3333333333333, 249, 460, 405.0, 460.0, 460.0, 460.0, 0.12290045063498566, 0.056969479721425645, 0.07881311450225317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 129.23076923076923, 95, 299, 98.0, 299.0, 299.0, 299.0, 0.06159561060202602, 0.016601941920077325, 0.036211482014081704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 157.9230769230769, 96, 295, 99.0, 294.6, 295.0, 295.0, 0.06159561060202602, 0.016601941920077325, 0.036271633977560246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 131.92307692307693, 97, 298, 102.0, 295.6, 298.0, 298.0, 0.06159152500615915, 0.04577260793914757, 0.03091605845035723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 175.0, 96, 295, 98.0, 295.0, 295.0, 295.0, 0.026016869338078813, 0.006961545115853119, 0.014837745794373072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 158.15384615384613, 97, 293, 101.0, 292.2, 293.0, 293.0, 0.06153933546985283, 0.01646657999876921, 0.035096652260150435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 140.0, 99, 286, 105.0, 286.0, 286.0, 286.0, 0.026041666666666668, 0.019353230794270832, 0.013071695963541666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 105.0, 101, 113, 104.0, 113.0, 113.0, 113.0, 0.025982124298482644, 0.020450773617750988, 0.009235833246726253], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 476.25, 98, 1119, 470.0, 862.1000000000003, 1119.0, 1119.0, 0.09793839674844522, 0.01928999061933794, 0.06664521394948827], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1781.0416666666672, 905, 6017, 1532.0, 2376.5, 5133.5, 6017.0, 0.11352187424614381, 0.05875643881880489, 0.05221562770501341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c296f96c-4275-41e1-bc87-9e4cd573ba19", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 318.0, 197, 579, 213.0, 579.0, 579.0, 579.0, 0.026001580896118485, 0.04029737195521488, 0.05847816484742273], "isController": false}, {"data": ["addBook", 50, 14, 28.0, 1129.8200000000002, 497, 3603, 871.5, 1973.6, 2870.0999999999967, 3603.0, 0.24270902100889286, 82.35486834855928, 0.8784549629140616], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 179.56363636363636, 96, 409, 101.0, 399.4, 402.79999999999995, 409.0, 0.24609161767206278, 0.18288644633636697, 0.11896030346452253], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 629.9999999999999, 466, 958, 582.0, 858.8, 878.0, 958.0, 0.24604758112859787, 72.34615840039994, 0.12374463308713664], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 139.94545454545457, 96, 330, 101.0, 293.0, 295.4, 330.0, 0.24647429721215164, 0.4361439712386902, 0.11986738282387843], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 977.1090909090907, 655, 1360, 992.0, 1171.6, 1282.3999999999996, 1360.0, 0.2457617273027874, 221.13683423008436, 0.12336086702503195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 116.24999999999999, 100, 309, 102.0, 170.40000000000015, 309.0, 309.0, 0.07791044194698195, 0.058204578212344905, 0.02769472741084124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 155, 14, 9.03225806451613, 198.28387096774182, 95, 2214, 104.0, 376.40000000000026, 559.9999999999998, 2084.6399999999994, 0.6497970956165945, 1.5821363835018614, 0.30565682433678776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 102.6, 99, 108, 102.5, 107.6, 108.0, 108.0, 0.05366015947799397, 0.04155518209575119, 0.01907450981444317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5c6c7de-4605-4c48-b1f4-c832f91d8762", 2, 0, 0.0, 449.0, 373, 525, 449.0, 525.0, 525.0, 525.0, 0.03681004177939742, 0.03249636500837429, 0.022880460539635213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f78d6fd6-a978-473b-85f2-32634281ad7f", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 127.44444444444443, 100, 299, 105.0, 296.3, 299.0, 299.0, 0.10832997309805668, 0.08791231215281749, 0.038507920124699835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfc4c23c-5984-4b1b-9f11-9790aa7e979c", 3, 0, 0.0, 783.6666666666666, 204, 1578, 569.0, 1578.0, 1578.0, 1578.0, 0.0650180967035825, 0.029418995578769425, 0.041694547690773937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c99bb21-dc14-4f3f-b66f-c142241842d5", 3, 0, 0.0, 606.6666666666666, 299, 769, 752.0, 769.0, 769.0, 769.0, 0.018641992953326664, 0.025699492238716936, 0.011954663449887217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5f97204-2b62-4dca-89f6-01cc6f58a37f", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b88e956-48b4-4bae-8705-60d9fb2579b2", 3, 0, 0.0, 318.6666666666667, 212, 440, 304.0, 440.0, 440.0, 440.0, 0.05347021708908138, 0.035002801616582896, 0.03428916916194346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1096c77-ffdf-472a-a4a1-e7a2fa29ad63", 3, 0, 0.0, 326.3333333333333, 230, 502, 247.0, 502.0, 502.0, 502.0, 0.051453563159248775, 0.03307968334619672, 0.032995937312408886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 274.59999999999997, 194, 587, 198.0, 567.6000000000001, 587.0, 587.0, 0.05029118596674747, 0.07794151575119944, 0.11310605593888615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e575ce86-66ad-4c12-b718-71eec1fea32a", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 322.2307692307692, 196, 598, 216.0, 592.8, 598.0, 598.0, 0.06150672552387171, 0.09532341152967226, 0.13833006726706693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59e7a9b4-d833-46b7-9aac-fd44e92d0c4f", 3, 0, 0.0, 767.0, 193, 1502, 606.0, 1502.0, 1502.0, 1502.0, 0.023483365949119376, 0.027756543542074363, 0.015059319960861057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 132.44444444444446, 102, 307, 111.0, 307.0, 307.0, 307.0, 0.042222993704082494, 0.03500715005348246, 0.015008954793248075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a195605b-f655-47cf-b1da-5a9d004963d5", 3, 0, 0.0, 791.3333333333334, 343, 1119, 912.0, 1119.0, 1119.0, 1119.0, 0.021593919152366695, 0.025902862004059658, 0.013847662998099735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 114.93333333333335, 99, 139, 116.0, 134.2, 139.0, 139.0, 0.08169623162515591, 0.06342627357617084, 0.029040457335504637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ec43a47-5f3d-4cab-a5d5-cb171bff0b51", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 125.68750000000001, 99, 293, 101.0, 292.3, 293.0, 293.0, 0.07496884107542803, 0.05571414849453196, 0.037630844055439455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 122.00000000000001, 96, 291, 99.0, 286.1, 291.0, 291.0, 0.0749705974688052, 0.02006049190083264, 0.04275666886892797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 110.12500000000001, 95, 288, 99.0, 157.10000000000014, 288.0, 288.0, 0.07496989490157858, 0.020206729485191102, 0.044074098369873346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 146.625, 96, 292, 99.5, 292.0, 292.0, 292.0, 0.07496989490157858, 0.020206729485191102, 0.04414731115786317], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.7148530579825259], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.23828435266084194], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.23828435266084194], "isController": false}, {"data": ["401/Unauthorized", 20, 57.142857142857146, 1.5885623510722795], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1259, 35, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 155, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
