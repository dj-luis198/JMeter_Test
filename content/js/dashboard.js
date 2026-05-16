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

    var data = {"OkPercent": 98.66666666666667, "KoPercent": 1.3333333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8234700739744452, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4107142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75262da3-d9bc-468f-ba42-27a5daf0a801"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8534702c-a95e-42f4-8638-f04568329a44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91cff0d9-9aef-4eb8-bc86-721a98d31dad"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/deefdf33-c1fa-4e30-9de9-097e8d9113de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d31a40e-aaac-491f-9185-96b774e512bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c251d72e-b3c8-486b-893e-ac0b400374c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/169f1ebf-d9eb-4e9a-af09-b51a1fdc4f18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/100e3e95-68d6-4360-8c19-21b379337ac8"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0ac07ed-bd1a-4c35-9929-d6f43ecde5c5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80479951-85e0-4741-87b2-f589b36f06ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=719f248c-8d9f-4edc-8e35-6a5eb96abdac"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c251d72e-b3c8-486b-893e-ac0b400374c2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0903bb79-1d18-4848-a050-0517b34fe22a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91cff0d9-9aef-4eb8-bc86-721a98d31dad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/954c2d11-d63e-43e0-8613-0bf3dc2dadad"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ba6aa91-b95b-4158-9aa9-cb33e27130df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8534702c-a95e-42f4-8638-f04568329a44"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a492d70-a32f-4882-aa36-a39745fc9a02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8303571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9668674698795181, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=deefdf33-c1fa-4e30-9de9-097e8d9113de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=100e3e95-68d6-4360-8c19-21b379337ac8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61678651-33a1-4e54-8a6f-97e4aad5ec82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d31a40e-aaac-491f-9185-96b774e512bf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ba6aa91-b95b-4158-9aa9-cb33e27130df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0ac07ed-bd1a-4c35-9929-d6f43ecde5c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=954c2d11-d63e-43e0-8613-0bf3dc2dadad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75262da3-d9bc-468f-ba42-27a5daf0a801"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/719f248c-8d9f-4edc-8e35-6a5eb96abdac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80479951-85e0-4741-87b2-f589b36f06ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0903bb79-1d18-4848-a050-0517b34fe22a"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1275, 17, 1.3333333333333333, 303.0541176470588, 76, 2686, 99.0, 829.0000000000023, 1012.6000000000001, 1624.44, 5.062939284437915, 715.9058504248898, 3.699928244003891], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1318.232142857143, 940, 1824, 1293.0, 1616.5, 1726.0, 1824.0, 0.26327171521522463, 316.80370103910053, 1.2945049669029844], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/75262da3-d9bc-468f-ba42-27a5daf0a801", 3, 0, 0.0, 368.3333333333333, 218, 550, 337.0, 550.0, 550.0, 550.0, 0.03816502557056713, 0.024188575776658273, 0.02447431652800041], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 566.7857142857143, 82, 1251, 448.0, 1074.0, 1251.0, 1251.0, 0.07481949796116869, 0.01412781675368887, 0.050598146814559875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 566.7857142857143, 82, 1251, 448.0, 1074.0, 1251.0, 1251.0, 0.07416511273097134, 0.01400425224349466, 0.0501556060216774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8534702c-a95e-42f4-8638-f04568329a44", 3, 0, 0.0, 337.0, 166, 434, 411.0, 434.0, 434.0, 434.0, 0.043189081800120925, 0.02776641814949181, 0.027696123419999424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 119.1875, 78, 245, 80.5, 238.70000000000002, 245.0, 245.0, 0.13635937513316346, 0.06208745962484127, 0.07633594901863862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 90.375, 79, 235, 80.5, 128.6000000000001, 235.0, 235.0, 0.13635472682182698, 0.10133393272598666, 0.06844368123673737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 167.9375, 77, 633, 80.5, 512.6000000000001, 633.0, 633.0, 0.1363582130256183, 5.043888968194447, 0.07883209190543558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 200.9375, 78, 914, 80.5, 772.6000000000001, 914.0, 914.0, 0.1363582130256183, 15.369078671231827, 0.07869892958802775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91cff0d9-9aef-4eb8-bc86-721a98d31dad", 3, 0, 0.0, 343.3333333333333, 242, 429, 359.0, 429.0, 429.0, 429.0, 0.019719457846372277, 0.023307731588599525, 0.012645615871534307], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 244.92857142857144, 80, 441, 211.0, 426.0, 441.0, 441.0, 0.07501111771923338, 0.16805818150279417, 0.04848828319643804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/deefdf33-c1fa-4e30-9de9-097e8d9113de", 3, 0, 0.0, 425.3333333333333, 197, 638, 441.0, 638.0, 638.0, 638.0, 0.021560242912070142, 0.025483477218009986, 0.013826067232024146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 81.57894736842105, 79, 87, 81.0, 84.0, 87.0, 87.0, 0.09008795429221687, 0.06695013009411821, 0.04521993018183542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 122.52631578947368, 79, 242, 81.0, 239.0, 242.0, 242.0, 0.09002264780297359, 0.03120439642183665, 0.05094312049294507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 556.2, 455, 625, 614.0, 625.0, 625.0, 625.0, 0.31248046997062684, 91.87963349946878, 0.1782115180301231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 909.4, 772, 1012, 930.0, 1012.0, 1012.0, 1012.0, 0.302571860816944, 272.2546922276853, 0.17226503403933435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 182.0, 77, 268, 236.0, 268.0, 268.0, 268.0, 0.31617554066017456, 0.5594824996838245, 0.1750698550335146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d31a40e-aaac-491f-9185-96b774e512bf", 3, 0, 0.0, 414.3333333333333, 187, 648, 408.0, 648.0, 648.0, 648.0, 0.0190836052747085, 0.022556175375151873, 0.012237858851294187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c251d72e-b3c8-486b-893e-ac0b400374c2", 3, 0, 0.0, 328.3333333333333, 190, 446, 349.0, 446.0, 446.0, 446.0, 0.019164430816404752, 0.02265170842915549, 0.012289690334738725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 140.75, 81, 244, 82.5, 244.0, 244.0, 244.0, 0.046838681725302846, 0.03480882499312057, 0.023510822662896152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 118.75, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.04688205062089416, 0.012544611201293946, 0.0267374194947287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 158.625, 79, 244, 156.0, 244.0, 244.0, 244.0, 0.04688232536333802, 0.012636251758087202, 0.027561679559306145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 169.25, 79, 322, 159.0, 322.0, 322.0, 322.0, 0.0468817758816704, 0.012636103655606475, 0.02760713950844458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 142.8, 80, 234, 88.0, 234.0, 234.0, 234.0, 0.3198362438431523, 0.23769080230921769, 0.1795955470798951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 133.21052631578945, 78, 768, 80.0, 239.0, 768.0, 768.0, 0.09002264780297359, 4.286278275699097, 0.052516295876015126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 613.7499999999999, 79, 1000, 821.0, 968.5, 1000.0, 1000.0, 0.07730327524314297, 43.481327710929236, 0.04129383941210859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 99.57894736842105, 77, 441, 80.0, 95.0, 441.0, 441.0, 0.09009051726181727, 1.4171938493070142, 0.05264386774000825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 418.9375, 78, 637, 617.0, 635.6, 637.0, 637.0, 0.07735971299546478, 14.224271700608242, 0.04139953390772921], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 521.5714285714286, 94, 1003, 428.0, 976.0, 1003.0, 1003.0, 0.07429026266914301, 0.014027883722472805, 0.050841362098699924], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/169f1ebf-d9eb-4e9a-af09-b51a1fdc4f18", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 351.5, 163, 480, 366.5, 480.0, 480.0, 480.0, 0.04681620542950942, 0.07255597462561665, 0.10529074326578144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 544.7142857142857, 107, 1404, 472.0, 1340.4, 1401.1, 1404.0, 0.09233975754217948, 0.056720417474639545, 0.041751277091825294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 101.75, 80, 242, 82.5, 237.1, 242.0, 242.0, 0.07735896493704914, 0.057490402653412494, 0.038830574196917246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 148.68750000000003, 78, 240, 85.5, 237.9, 240.0, 240.0, 0.07730178132292337, 0.09324904822181747, 0.04002858354148448], "isController": false}, {"data": ["login", 21, 0, 0.0, 2759.3333333333335, 1585, 3933, 2689.0, 3653.2000000000003, 3906.7999999999997, 3933.0, 0.09553270857974706, 27.34335461258075, 0.18185600007961059], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 93.84210526315789, 81, 244, 84.0, 103.0, 244.0, 244.0, 0.092908172496247, 0.07521569824159059, 0.0330259519420253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/100e3e95-68d6-4360-8c19-21b379337ac8", 3, 0, 0.0, 950.3333333333334, 166, 2147, 538.0, 2147.0, 2147.0, 2147.0, 0.08584182213574454, 0.03884118905230628, 0.0550483039086643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 717.3125, 162, 1081, 902.5, 1050.2, 1081.0, 1081.0, 0.07727116867813177, 57.82189667214809, 0.16142807382294277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0ac07ed-bd1a-4c35-9929-d6f43ecde5c5", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 322.4375, 160, 1150, 244.0, 900.8000000000003, 1150.0, 1150.0, 0.13626182710077414, 20.561846502116314, 0.30209805954641844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 774.8571428571428, 80, 1212, 1010.0, 1212.0, 1212.0, 1212.0, 0.20016012810248196, 171.05894537058217, 0.3602770609344618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80479951-85e0-4741-87b2-f589b36f06ce", 3, 0, 0.0, 534.6666666666666, 186, 998, 420.0, 998.0, 998.0, 998.0, 0.018531902670447173, 0.02554772389627076, 0.011884065189056292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=719f248c-8d9f-4edc-8e35-6a5eb96abdac", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 953.6666666666667, 223, 1898, 961.5, 1667.5, 1869.5, 1898.0, 0.09548514410299663, 0.029839107532186448, 0.043080211499594186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c251d72e-b3c8-486b-893e-ac0b400374c2", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 241.00000000000003, 160, 850, 165.0, 321.0, 850.0, 850.0, 0.0899859811313606, 5.798147902024211, 0.20116880393238737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 84.84615384615385, 81, 90, 84.0, 90.0, 90.0, 90.0, 0.07075715599775755, 0.054933534197477776, 0.025151957796077876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0903bb79-1d18-4848-a050-0517b34fe22a", 3, 0, 0.0, 286.3333333333333, 206, 385, 268.0, 385.0, 385.0, 385.0, 0.0190554832152952, 0.026257116032013212, 0.012219824848350113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91cff0d9-9aef-4eb8-bc86-721a98d31dad", 1, 0, 0.0, 949.0, 949, 949, 949.0, 949.0, 949.0, 949.0, 1.053740779768177, 0.1903730900948367, 0.7265048735511065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/954c2d11-d63e-43e0-8613-0bf3dc2dadad", 3, 0, 0.0, 283.3333333333333, 183, 386, 281.0, 386.0, 386.0, 386.0, 0.05139186295503212, 0.03304001605995718, 0.0329563704496788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 252.8421052631579, 159, 946, 164.0, 477.0, 946.0, 946.0, 0.11020625971555185, 7.10101935352428, 0.2463723923893877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 82.33333333333333, 79, 94, 81.0, 91.00000000000001, 94.0, 94.0, 0.05720660164182947, 0.042513890477961155, 0.028715032464746434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 105.33333333333334, 77, 238, 80.0, 235.9, 238.0, 238.0, 0.05720769252772189, 0.015307527102144334, 0.032626262144716395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 93.25, 77, 236, 80.5, 190.10000000000016, 236.0, 236.0, 0.057208237986270026, 0.015419407894736843, 0.033632186784897024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 80.75000000000001, 78, 93, 80.0, 89.70000000000002, 93.0, 93.0, 0.057207419802348364, 0.015419187368601707, 0.033687572403140686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 3.137466755319149, 6.576213430851064], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 909.767857142857, 616, 1485, 818.0, 1257.6000000000001, 1324.4499999999998, 1485.0, 0.2522840718649199, 301.8194580848035, 0.4981624934676446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 953.6666666666667, 223, 1898, 961.5, 1667.5, 1869.5, 1898.0, 0.09591022802656714, 0.02997194625830223, 0.04327199741042384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 81.875, 77, 95, 80.0, 95.0, 95.0, 95.0, 0.06174697632775295, 0.016642739713339662, 0.036360768286752956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ba6aa91-b95b-4158-9aa9-cb33e27130df", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 81.75, 78, 92, 80.0, 92.0, 92.0, 92.0, 0.06174649974529568, 0.01664261125947423, 0.03630018832682422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 80.53846153846155, 78, 94, 80.0, 88.8, 94.0, 94.0, 0.06863599165808718, 0.018499544626593808, 0.04035045603336765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 112.53846153846153, 78, 324, 80.0, 290.0, 324.0, 324.0, 0.06863635403687356, 0.018499642299001078, 0.04041769676194801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 80.625, 77, 88, 79.5, 88.0, 88.0, 88.0, 0.06174792951473846, 0.016522395202185878, 0.03521561605137428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 82.23076923076923, 79, 93, 82.0, 89.8, 93.0, 93.0, 0.06863562928312725, 0.05100753309029281, 0.034451868605007235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 81.75, 78, 89, 80.5, 89.0, 89.0, 89.0, 0.061743640405038276, 0.04588565463694739, 0.030992413250185227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 106.38461538461539, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.06863599165808718, 0.018365489955386605, 0.03914396399250284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 124.375, 83, 242, 88.0, 242.0, 242.0, 242.0, 0.06079073549191103, 0.04784895781882841, 0.02160920675689025], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 461.4285714285715, 80, 654, 440.0, 651.0, 654.0, 654.0, 0.07490716861603657, 0.013998068130745113, 0.05098139259114597], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1649.571428571429, 864, 2686, 1599.0, 2344.6, 2654.3999999999996, 2686.0, 0.09416153635756275, 0.048735951435066656, 0.04331062853946489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 165.375, 159, 176, 164.5, 176.0, 176.0, 176.0, 0.061705065214540805, 0.09563079931198852, 0.13877613787996823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8534702c-a95e-42f4-8638-f04568329a44", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["addBook", 55, 5, 9.090909090909092, 850.9272727272729, 415, 1497, 701.0, 1435.3999999999999, 1489.3999999999999, 1497.0, 0.26012230477821024, 80.24109864428985, 0.94617640903523], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a492d70-a32f-4882-aa36-a39745fc9a02", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 144.67857142857144, 78, 340, 82.0, 323.20000000000005, 329.3, 340.0, 0.2529153004724096, 0.18795756216748413, 0.12225886106820584], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 514.2142857142857, 386, 807, 470.0, 682.9000000000001, 717.75, 807.0, 0.2528113981824666, 74.33494519410047, 0.12714635748434602], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 132.87500000000003, 78, 248, 85.0, 239.3, 242.3, 248.0, 0.2532515692552595, 0.4481365659087209, 0.123163360829218], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 762.8214285714286, 534, 1155, 722.5, 975.8000000000001, 1038.35, 1155.0, 0.25270986200236467, 227.388778046282, 0.12684850495040567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 106.15789473684211, 82, 243, 85.0, 243.0, 243.0, 243.0, 0.10775128734432773, 0.08049778790860422, 0.038302215423179006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 5, 3.0120481927710845, 138.5421686746988, 79, 598, 87.0, 262.6, 325.60000000000014, 484.77000000000214, 0.688790964390337, 1.5386364143243625, 0.3291069355752234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 103.33333333333333, 80, 287, 86.5, 230.3000000000002, 287.0, 287.0, 0.0573871624917506, 0.0444414256405842, 0.02039934291698947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=deefdf33-c1fa-4e30-9de9-097e8d9113de", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 113.1875, 81, 246, 85.5, 245.3, 246.0, 246.0, 0.13585456768529292, 0.11024916576804532, 0.04829205335688146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=100e3e95-68d6-4360-8c19-21b379337ac8", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 203.49999999999997, 160, 320, 166.0, 319.7, 320.0, 320.0, 0.05718452015039529, 0.08862483738152081, 0.12860932608043002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61678651-33a1-4e54-8a6f-97e4aad5ec82", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 220.6153846153846, 161, 407, 166.0, 373.4, 407.0, 407.0, 0.06860665167875199, 0.10632691036540959, 0.15429796759391196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d31a40e-aaac-491f-9185-96b774e512bf", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ba6aa91-b95b-4158-9aa9-cb33e27130df", 3, 0, 0.0, 366.66666666666663, 191, 654, 255.0, 654.0, 654.0, 654.0, 0.06710658763001902, 0.031150388658986693, 0.043033846885135896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 84.24999999999999, 82, 89, 83.5, 89.0, 89.0, 89.0, 0.0487578926838782, 0.040425245008410736, 0.01733190716497233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0ac07ed-bd1a-4c35-9929-d6f43ecde5c5", 3, 0, 0.0, 254.0, 172, 401, 189.0, 401.0, 401.0, 401.0, 0.037750094375235944, 0.03147070042154272, 0.0242082310934944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=954c2d11-d63e-43e0-8613-0bf3dc2dadad", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75262da3-d9bc-468f-ba42-27a5daf0a801", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.18012369142572285, 0.6873909521435694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.375, 82, 275, 85.0, 156.0000000000001, 275.0, 275.0, 0.0738055040454642, 0.057300171597796906, 0.0262355502661611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/719f248c-8d9f-4edc-8e35-6a5eb96abdac", 3, 0, 0.0, 314.0, 216, 451, 275.0, 451.0, 451.0, 451.0, 0.018754102459913106, 0.025854044244053385, 0.012026556590504172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80479951-85e0-4741-87b2-f589b36f06ce", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 88.73684210526316, 77, 240, 80.0, 83.0, 240.0, 240.0, 0.11025742206541167, 0.08193935370290847, 0.05534405756017734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 128.6842105263158, 76, 237, 80.0, 235.0, 237.0, 237.0, 0.11025870173280256, 0.03821878518123049, 0.06239454698181312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0903bb79-1d18-4848-a050-0517b34fe22a", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 137.3684210526316, 77, 866, 80.0, 239.0, 866.0, 866.0, 0.11025998142989787, 5.249845173586931, 0.06432210059772517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 124.57894736842101, 77, 459, 80.0, 241.0, 459.0, 459.0, 0.11025870173280256, 1.7344550645013406, 0.06442902857731456], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 47.05882352941177, 0.6274509803921569], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.0784313725490196], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.0784313725490196], "isController": false}, {"data": ["401/Unauthorized", 7, 41.1764705882353, 0.5490196078431373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1275, 17, "406/Not Acceptable", 8, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
