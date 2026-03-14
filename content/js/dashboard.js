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

    var data = {"OkPercent": 98.2985305491106, "KoPercent": 1.7014694508894044};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7755305039787799, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05454545454545454, 500, 1500, "see books"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a554aa2e-a83c-4c15-aea9-f7dcf3661ecd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5547b7bc-88a7-4c5f-a8fc-b583a51f7e4d"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0bc0653-2a53-4bef-990a-196f90f90f0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6018fb3a-ccee-4f31-b416-788f502d6561"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=113f5f6e-d5f4-475b-a993-3a1278a6d0a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6875a362-8662-47e7-a224-860dd6600f5b"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2441a118-6e4e-406f-ad40-7a96453f1b2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/113f5f6e-d5f4-475b-a993-3a1278a6d0a6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b8ee1230-3f0f-454b-af5b-ee1c6b8d9158"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6405328a-8403-4cb4-a058-341756657ad8"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d131827-c2e6-4c9e-8706-e3d0be23e263"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6831a1d9-b5c8-4af0-a549-ef93d124aab5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a1e7536-4180-46d0-ba45-216680ad8026"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59c59742-c9f1-484b-ae9f-d70d72f7d705"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a554aa2e-a83c-4c15-aea9-f7dcf3661ecd"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5547b7bc-88a7-4c5f-a8fc-b583a51f7e4d"], "isController": false}, {"data": [0.43636363636363634, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6831a1d9-b5c8-4af0-a549-ef93d124aab5"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83f55008-bafa-459a-9cac-0d4cb8e294ac"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eac33c3a-2c3a-452b-8a6b-a0be648c6071"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.9454545454545454, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2441a118-6e4e-406f-ad40-7a96453f1b2e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0bc0653-2a53-4bef-990a-196f90f90f0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eac33c3a-2c3a-452b-8a6b-a0be648c6071"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/184eb7b5-3c30-49e7-9ecc-efe99dc99d87"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6018fb3a-ccee-4f31-b416-788f502d6561"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d131827-c2e6-4c9e-8706-e3d0be23e263"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8ee1230-3f0f-454b-af5b-ee1c6b8d9158"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a1e7536-4180-46d0-ba45-216680ad8026"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6405328a-8403-4cb4-a058-341756657ad8"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59c59742-c9f1-484b-ae9f-d70d72f7d705"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 22, 1.7014694508894044, 377.31863882443923, 114, 2658, 140.0, 979.8000000000004, 1155.1999999999985, 1505.8999999999992, 4.994572795995071, 696.4237844499501, 3.6530380693735736], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1790.5818181818186, 1425, 2323, 1780.0, 2075.6, 2148.3999999999996, 2323.0, 0.2484898593547396, 299.01691464119193, 1.2218226971202284], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 483.5714285714286, 122, 758, 433.0, 752.5, 758.0, 758.0, 0.10268823119521767, 0.01939013963765724, 0.06944492197528147], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 483.5714285714286, 122, 758, 433.0, 752.5, 758.0, 758.0, 0.10273796681563672, 0.01939953098283542, 0.0694785566599887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 183.23529411764704, 118, 377, 126.0, 376.2, 377.0, 377.0, 0.1012187933529023, 0.036026633939256814, 0.057226296195959585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 127.5294117647059, 120, 173, 126.0, 138.59999999999997, 173.0, 173.0, 0.10121758804441666, 0.0752212739275401, 0.050806484623857576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 208.58823529411765, 117, 590, 127.0, 417.99999999999983, 590.0, 590.0, 0.1012206013694552, 1.7763959697826734, 0.059093805820184586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 237.70588235294122, 115, 1126, 126.0, 526.7999999999995, 1126.0, 1126.0, 0.10121758804441666, 5.38307438190289, 0.05899320130392069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a554aa2e-a83c-4c15-aea9-f7dcf3661ecd", 3, 0, 0.0, 361.3333333333333, 226, 454, 404.0, 454.0, 454.0, 454.0, 0.037695071997587516, 0.03105671459176237, 0.02417294656095293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5547b7bc-88a7-4c5f-a8fc-b583a51f7e4d", 3, 0, 0.0, 315.0, 230, 439, 276.0, 439.0, 439.0, 439.0, 0.07429052548165024, 0.03448512022683374, 0.047640734114209306], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 368.42857142857144, 119, 1277, 226.0, 1157.0, 1277.0, 1277.0, 0.10306925517738955, 0.21906530449602818, 0.06662547347439098], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0bc0653-2a53-4bef-990a-196f90f90f0b", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.2105641754079254, 0.8035584207459208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 147.65, 117, 362, 125.5, 329.30000000000047, 361.45, 362.0, 0.11931679204872898, 0.08867195190340112, 0.05989143663383466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 187.05000000000004, 120, 380, 125.0, 377.9, 379.9, 380.0, 0.11932462263588091, 0.040889658284111924, 0.06755125365431656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 750.7142857142858, 597, 875, 831.0, 875.0, 875.0, 875.0, 0.09490367277213628, 27.904830893518078, 0.05412475087785897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1002.2857142857143, 839, 1193, 1063.0, 1193.0, 1193.0, 1193.0, 0.09456264775413711, 85.08763667257682, 0.05383791371158392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 193.71428571428572, 121, 383, 127.0, 383.0, 383.0, 383.0, 0.09551359021940836, 0.16901428269293747, 0.05288691958437944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 146.72727272727272, 118, 361, 126.0, 316.00000000000017, 361.0, 361.0, 0.06413059320798718, 0.047659552178982656, 0.032190551668852936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 144.9090909090909, 116, 381, 121.0, 330.20000000000016, 381.0, 381.0, 0.06413171488205595, 0.017160244021175126, 0.036575118643672536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 145.81818181818184, 117, 373, 125.0, 323.60000000000014, 373.0, 373.0, 0.06413321050851806, 0.017285904394874006, 0.037703313209109246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 169.72727272727272, 117, 393, 122.0, 388.8, 393.0, 393.0, 0.06413134098634002, 0.01728540050022446, 0.03776484239722953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 161.85714285714283, 121, 378, 126.0, 378.0, 378.0, 378.0, 0.09552010698251981, 0.07098711075556405, 0.05363677882319228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 182.35, 115, 839, 122.5, 376.90000000000003, 815.9999999999997, 839.0, 0.11932747037695547, 5.399107738162715, 0.06963876591530137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 697.888888888889, 114, 1350, 854.5, 1260.9, 1350.0, 1350.0, 0.08536064874093044, 42.681148708327406, 0.04610734694361455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6018fb3a-ccee-4f31-b416-788f502d6561", 3, 0, 0.0, 625.6666666666666, 231, 903, 743.0, 903.0, 903.0, 903.0, 0.01780056249777493, 0.024539512427759386, 0.011415074258013221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 171.79999999999998, 116, 874, 124.5, 332.2000000000005, 848.0499999999996, 874.0, 0.11932391072184999, 1.7848130306185157, 0.06975321577939396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 539.7777777777779, 116, 1003, 716.5, 973.3000000000001, 1003.0, 1003.0, 0.0853651017978839, 13.954767314888148, 0.04619311660872905], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 732.5, 123, 2658, 470.5, 1925.5, 2658.0, 2658.0, 0.10218903511653199, 0.019295878770957876, 0.0699341952795965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=113f5f6e-d5f4-475b-a993-3a1278a6d0a6", 1, 0, 0.0, 2658.0, 2658, 2658, 2658.0, 2658.0, 2658.0, 2658.0, 0.3762227238525207, 0.06796992569601204, 0.2593879326561324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6875a362-8662-47e7-a224-860dd6600f5b", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 318.90909090909093, 242, 734, 253.0, 693.0000000000001, 734.0, 734.0, 0.06408463832960477, 0.09931867287996365, 0.14412785358699198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2441a118-6e4e-406f-ad40-7a96453f1b2e", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/113f5f6e-d5f4-475b-a993-3a1278a6d0a6", 3, 0, 0.0, 314.6666666666667, 203, 500, 241.0, 500.0, 500.0, 500.0, 0.02760092739116034, 0.0230097575028521, 0.017699813463732384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8ee1230-3f0f-454b-af5b-ee1c6b8d9158", 3, 0, 0.0, 847.6666666666666, 231, 1800, 512.0, 1800.0, 1800.0, 1800.0, 0.023931460297707364, 0.028286175892244612, 0.015346672131016767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6405328a-8403-4cb4-a058-341756657ad8", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 472.17391304347825, 181, 978, 465.0, 749.2000000000002, 940.7999999999995, 978.0, 0.09992397089171283, 0.061379079776257194, 0.045180467307483436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 152.5555555555556, 119, 372, 127.0, 365.7, 372.0, 372.0, 0.08536388728172928, 0.06343937326308202, 0.04284866998321177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 191.61111111111111, 116, 376, 127.0, 362.5, 376.0, 376.0, 0.08536145835309293, 0.0940680307111558, 0.04469991297873551], "isController": false}, {"data": ["login", 23, 0, 0.0, 2302.652173913043, 1519, 4631, 2121.0, 3199.6000000000004, 4375.999999999996, 4631.0, 0.09739737281173512, 35.59482352151847, 0.19610567323816622], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 145.04999999999998, 125, 377, 131.0, 160.80000000000004, 366.29999999999984, 377.0, 0.11720237920829793, 0.09488356676140525, 0.041661783234199654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d131827-c2e6-4c9e-8706-e3d0be23e263", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6831a1d9-b5c8-4af0-a549-ef93d124aab5", 3, 0, 0.0, 869.0, 346, 1277, 984.0, 1277.0, 1277.0, 1277.0, 0.021227666725632408, 0.025090383424730234, 0.013612794091632763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 856.8333333333335, 251, 1480, 1020.0, 1390.0000000000002, 1480.0, 1480.0, 0.08531210009953079, 56.76039148774823, 0.17974230117541115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a1e7536-4180-46d0-ba45-216680ad8026", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59c59742-c9f1-484b-ae9f-d70d72f7d705", 3, 0, 0.0, 318.0, 235, 452, 267.0, 452.0, 452.0, 452.0, 0.07972362476747276, 0.03529431304809992, 0.051124850518203556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 413.9411764705882, 245, 1250, 258.0, 687.5999999999995, 1250.0, 1250.0, 0.10114110969645769, 7.265171352375626, 0.2259464967248129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 933.6666666666666, 119, 1322, 1189.0, 1322.0, 1322.0, 1322.0, 0.12138050089686704, 112.95087798562315, 0.2307493897258149], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 927.1666666666667, 191, 1798, 962.5, 1549.0, 1736.5, 1798.0, 0.10397126927259101, 0.032643323311658215, 0.04690891250384477], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 386.09999999999997, 244, 1239, 254.0, 707.1000000000005, 1213.4999999999995, 1239.0, 0.1192271694873828, 7.307397123719053, 0.2666194291105057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 151.91666666666666, 127, 375, 130.5, 304.5000000000002, 375.0, 375.0, 0.0623742768482278, 0.04842534188900498, 0.02217210622339347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a554aa2e-a83c-4c15-aea9-f7dcf3661ecd", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 406.5, 250, 1246, 280.0, 582.7000000000011, 1246.0, 1246.0, 0.0845880561664693, 5.74585206459473, 0.1890381515629993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 157.14285714285714, 117, 361, 125.0, 361.0, 361.0, 361.0, 0.05036949623308124, 0.037432799446655105, 0.025283126038870857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 121.42857142857143, 115, 127, 121.0, 127.0, 127.0, 127.0, 0.05036587208507515, 0.013476805616514249, 0.028724286423519423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 154.85714285714286, 120, 348, 122.0, 348.0, 348.0, 348.0, 0.05036623447640702, 0.01357527413621908, 0.02960983706523147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 174.71428571428572, 121, 482, 123.0, 482.0, 482.0, 482.0, 0.05036587208507515, 0.013575176460430412, 0.029658809440722966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5547b7bc-88a7-4c5f-a8fc-b583a51f7e4d", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1155.9272727272728, 920, 1757, 1001.0, 1544.8, 1622.9999999999993, 1757.0, 0.23565402561345025, 281.9241412285287, 0.46532464823280906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6831a1d9-b5c8-4af0-a549-ef93d124aab5", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.17371544471153846, 0.6629356971153846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 927.1666666666667, 191, 1798, 962.5, 1549.0, 1736.5, 1798.0, 0.09882969173371986, 0.031029048723038022, 0.04458917732517439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 123.33333333333333, 117, 128, 122.0, 128.0, 128.0, 128.0, 0.05089547765405779, 0.013717921711445261, 0.029970676782614104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 151.66666666666663, 120, 381, 123.0, 381.0, 381.0, 381.0, 0.050894326413589916, 0.013717611416162907, 0.029920297364239387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 186.66666666666666, 117, 379, 125.5, 377.5, 379.0, 379.0, 0.06247852300771609, 0.01683991440442348, 0.036730537940083095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 164.16666666666669, 115, 382, 126.5, 370.90000000000003, 382.0, 382.0, 0.06255995328856821, 0.0168618624098094, 0.036839503743170535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 126.66666666666667, 120, 136, 126.0, 135.7, 136.0, 136.0, 0.06255538758275556, 0.04648891596726268, 0.03139987228275035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 149.55555555555554, 114, 373, 121.0, 373.0, 373.0, 373.0, 0.050895765472312705, 0.013618593495521173, 0.029026491245928338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 182.58333333333334, 114, 381, 125.5, 373.5, 381.0, 381.0, 0.06248828344685372, 0.016720497719177656, 0.03563784915328376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 153.33333333333334, 121, 380, 127.0, 380.0, 380.0, 380.0, 0.05089547765405779, 0.03782368993626755, 0.025547144056821975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 158.0, 123, 383, 129.0, 383.0, 383.0, 383.0, 0.05020500376537528, 0.039516829135637185, 0.017846309932223248], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 523.5, 120, 984, 476.0, 909.5, 984.0, 984.0, 0.10511378567299101, 0.01964284541140785, 0.0715398442251237], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1157.2608695652173, 719, 2331, 1108.0, 1442.4, 2156.3999999999974, 2331.0, 0.0974258398742783, 0.050425483528679205, 0.04481208064529793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 307.3333333333333, 242, 761, 252.0, 761.0, 761.0, 761.0, 0.05085895117540687, 0.0788214409329792, 0.11438297320015822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83f55008-bafa-459a-9cac-0d4cb8e294ac", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eac33c3a-2c3a-452b-8a6b-a0be648c6071", 3, 0, 0.0, 534.3333333333334, 204, 855, 544.0, 855.0, 855.0, 855.0, 0.018727293157047083, 0.02581708545575989, 0.012009364426882406], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1135.0701754385964, 616, 2419, 981.0, 1898.0000000000002, 2058.199999999999, 2419.0, 0.2898919262555626, 80.23956512237763, 1.0555665924984108], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 225.76363636363638, 117, 516, 128.0, 506.8, 512.0, 516.0, 0.23650827778972264, 0.17576445253708878, 0.11432773193936788], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 685.8545454545452, 572, 1001, 624.0, 874.6, 952.9999999999998, 1001.0, 0.23640763553679578, 69.51169432009164, 0.11889641826313459], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 198.90909090909093, 114, 488, 129.0, 378.0, 380.2, 488.0, 0.23664871004939503, 0.41875728770459353, 0.11508892344199094], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 923.5818181818183, 790, 1242, 870.0, 1121.4, 1147.3999999999996, 1242.0, 0.23617922138151964, 212.51447855787893, 0.11855089823252059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 146.22222222222226, 122, 382, 131.0, 175.00000000000034, 382.0, 382.0, 0.08257373146105043, 0.061688383366898025, 0.02935238110529527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2441a118-6e4e-406f-ad40-7a96453f1b2e", 3, 0, 0.0, 293.0, 212, 411, 256.0, 411.0, 411.0, 411.0, 0.0778917304946125, 0.03524397961833052, 0.04995010061015189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, 6.508875739644971, 195.60946745562126, 116, 1453, 132.0, 332.0, 405.5, 1133.1000000000051, 0.6873439241237381, 1.4934049680934138, 0.32945688772501364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 160.14285714285714, 124, 348, 130.0, 348.0, 348.0, 348.0, 0.051931094855854114, 0.040216170137394834, 0.01845988137454189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0bc0653-2a53-4bef-990a-196f90f90f0b", 3, 0, 0.0, 585.6666666666666, 296, 1037, 424.0, 1037.0, 1037.0, 1037.0, 0.023908192540643927, 0.023978236073477845, 0.015331751075868663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 145.64705882352942, 122, 389, 129.0, 206.59999999999985, 389.0, 389.0, 0.10019154265507588, 0.08130778510387505, 0.035614962428171505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eac33c3a-2c3a-452b-8a6b-a0be648c6071", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.17489260648596322, 0.6674280009680542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/184eb7b5-3c30-49e7-9ecc-efe99dc99d87", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.8630701013513513, 1.6126478040540542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 334.1428571428571, 241, 845, 251.0, 845.0, 845.0, 845.0, 0.050323508267433495, 0.07799160900431344, 0.11317874955068297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6018fb3a-ccee-4f31-b416-788f502d6561", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 359.0, 249, 508, 262.5, 507.4, 508.0, 508.0, 0.06243431389891884, 0.09676099234139082, 0.14041623526290048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d131827-c2e6-4c9e-8706-e3d0be23e263", 3, 0, 0.0, 357.3333333333333, 221, 569, 282.0, 569.0, 569.0, 569.0, 0.01761948950465742, 0.024289888688875057, 0.011298956485734087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 127.36363636363637, 120, 131, 128.0, 130.8, 131.0, 131.0, 0.06280044302857991, 0.05206794544068784, 0.022323594982815515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8ee1230-3f0f-454b-af5b-ee1c6b8d9158", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 130.6111111111111, 120, 145, 128.5, 141.4, 145.0, 145.0, 0.08351854343660246, 0.06484105667197164, 0.029688232237229783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a1e7536-4180-46d0-ba45-216680ad8026", 3, 0, 0.0, 485.33333333333337, 214, 835, 407.0, 835.0, 835.0, 835.0, 0.046403712296983764, 0.029833115815931937, 0.029757588940448568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 126.66666666666667, 119, 149, 126.5, 131.00000000000003, 149.0, 149.0, 0.08473698581126249, 0.06297348261950268, 0.042533994831043864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 177.11111111111111, 115, 378, 126.0, 363.6, 378.0, 378.0, 0.08464533604198408, 0.02971220291838309, 0.04787935512010233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 249.05555555555554, 119, 1123, 127.0, 451.60000000000105, 1123.0, 1123.0, 0.08463936576901918, 4.2525816843351345, 0.04935459544734256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6405328a-8403-4cb4-a058-341756657ad8", 3, 0, 0.0, 270.3333333333333, 207, 392, 212.0, 392.0, 392.0, 392.0, 0.03241210916398367, 0.027020641786771535, 0.020785109066747336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 233.44444444444446, 117, 600, 128.0, 401.1000000000003, 600.0, 600.0, 0.08473738472184954, 1.4057707777244246, 0.049494503250620235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59c59742-c9f1-484b-ae9f-d70d72f7d705", 1, 0, 0.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 0.1514367665549036, 0.5779154442581727], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5413766434648105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07733952049497293], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.005413766434648], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 22, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
