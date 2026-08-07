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

    var data = {"OkPercent": 98.98278560250391, "KoPercent": 1.0172143974960877};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7660364618501013, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7406c67a-d204-4689-a29c-8c55f6252d0f"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/496482b8-894e-4d7b-a5fd-7883c7a6265a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef39eb6f-f38f-483c-bf21-cad558c1e723"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c28c628a-46ba-40c8-a659-4b37b3dc7d7f"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b27f20a1-d100-4d5a-b4ee-7c9baf4cd7ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e372c0f8-8fa0-4bce-addb-bc4a0fb2851c"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b840e3ff-15c0-420c-9f69-3dfd501569fc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b27f20a1-d100-4d5a-b4ee-7c9baf4cd7ac"], "isController": false}, {"data": [0.525, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dd6ebef-2523-45eb-ba2c-d92d055ba8c1"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e999924f-7301-4319-8a89-b292f266517d"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e2e6fdff-dfc6-488b-af47-a89ebf2b8c92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e630ed46-9d04-4cdf-a1fd-b9463fa6ae42"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7158c538-cf20-4690-b9dd-32c3d3845395"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2e6fdff-dfc6-488b-af47-a89ebf2b8c92"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e372c0f8-8fa0-4bce-addb-bc4a0fb2851c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e0cc5a1-d744-45bb-85ee-afb5d8d2f332"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef39eb6f-f38f-483c-bf21-cad558c1e723"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b840e3ff-15c0-420c-9f69-3dfd501569fc"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c28c628a-46ba-40c8-a659-4b37b3dc7d7f"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441176470588235, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0c6beb4-ab43-4b15-aa1c-e2f21502c3b2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e0cc5a1-d744-45bb-85ee-afb5d8d2f332"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e630ed46-9d04-4cdf-a1fd-b9463fa6ae42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7158c538-cf20-4690-b9dd-32c3d3845395"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=496482b8-894e-4d7b-a5fd-7883c7a6265a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dd6ebef-2523-45eb-ba2c-d92d055ba8c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7406c67a-d204-4689-a29c-8c55f6252d0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e201cb5a-9e7e-4379-94f5-694d00845725"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 13, 1.0172143974960877, 431.86932707355294, 111, 4641, 135.0, 1217.0, 1427.1, 2071.620000000001, 5.183448656278138, 740.9113707722244, 3.794383817794479], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7406c67a-d204-4689-a29c-8c55f6252d0f", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1927.1428571428576, 1502, 2591, 1911.0, 2315.3, 2416.1, 2591.0, 0.23935101681440893, 288.0194255989652, 1.1768870797466298], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/496482b8-894e-4d7b-a5fd-7883c7a6265a", 3, 0, 0.0, 308.3333333333333, 230, 463, 232.0, 463.0, 463.0, 463.0, 0.02268671163677062, 0.026814925114946007, 0.01454844463686137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef39eb6f-f38f-483c-bf21-cad558c1e723", 1, 0, 0.0, 1493.0, 1493, 1493, 1493.0, 1493.0, 1493.0, 1493.0, 0.6697923643670461, 0.1210074095780308, 0.4617904387139986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c28c628a-46ba-40c8-a659-4b37b3dc7d7f", 1, 0, 0.0, 2970.0, 2970, 2970, 2970.0, 2970.0, 2970.0, 2970.0, 0.3367003367003367, 0.06082965067340067, 0.23213909932659932], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 705.5833333333334, 441, 1339, 514.0, 1294.3000000000002, 1339.0, 1339.0, 0.06828269033799932, 0.012336228234892454, 0.04641089108910891], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 705.5833333333334, 441, 1339, 514.0, 1294.3000000000002, 1339.0, 1339.0, 0.06930046951068093, 0.012520104354957005, 0.04710266287054095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 180.07142857142858, 113, 345, 117.5, 342.5, 345.0, 345.0, 0.09702614854703343, 0.036371269691110326, 0.05475317674006002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 152.71428571428572, 113, 365, 117.5, 351.5, 365.0, 365.0, 0.09702413128751022, 0.07210484756815945, 0.048701565900176026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 207.42857142857144, 111, 894, 120.5, 629.0, 894.0, 894.0, 0.0970254761178721, 2.062048549988911, 0.05653953874781693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 259.1428571428571, 111, 1216, 121.0, 780.5, 1216.0, 1216.0, 0.09702682098551528, 6.260348354442443, 0.056445569686048934], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 304.0, 219, 576, 237.0, 549.3000000000001, 576.0, 576.0, 0.06792440014264124, 0.16431093703125088, 0.04391206337346533], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 116.81250000000001, 113, 128, 115.0, 125.2, 128.0, 128.0, 0.10080454628503745, 0.07491431613565772, 0.050599157021981686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 116.0625, 111, 128, 114.0, 127.3, 128.0, 128.0, 0.10081216802868107, 0.036438577823843334, 0.05696527414608943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 867.2, 665, 1225, 883.0, 1225.0, 1225.0, 1225.0, 0.083295850200743, 24.49174564154464, 0.04750466456761124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1280.4, 1062, 1434, 1303.0, 1434.0, 1434.0, 1434.0, 0.08240626287597858, 74.14930019056449, 0.04691684693036671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 271.0, 112, 410, 338.0, 410.0, 410.0, 410.0, 0.08371002846140967, 0.14812751130085386, 0.046351158337518836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b27f20a1-d100-4d5a-b4ee-7c9baf4cd7ac", 3, 0, 0.0, 1268.3333333333333, 219, 3038, 548.0, 3038.0, 3038.0, 3038.0, 0.04603557015053632, 0.02959643588779597, 0.029521508202004082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 116.58333333333334, 113, 123, 115.0, 122.7, 123.0, 123.0, 0.06895521358877409, 0.051245036661188556, 0.03461228494592762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 135.66666666666666, 112, 354, 116.0, 284.40000000000026, 354.0, 354.0, 0.06895362868470953, 0.027080909182324888, 0.03884253074182612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 252.83333333333331, 112, 1333, 114.5, 1035.100000000001, 1333.0, 1333.0, 0.06895640231463657, 5.187628081130081, 0.0400449940525103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 204.91666666666666, 112, 960, 115.5, 773.7000000000007, 960.0, 960.0, 0.06895323247007716, 1.7065812807775627, 0.04011049037240492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 115.8, 112, 122, 115.0, 122.0, 122.0, 122.0, 0.08406469619018797, 0.06247386113352836, 0.0472042971771075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 869.6470588235293, 114, 1922, 1121.0, 1640.3999999999996, 1922.0, 1922.0, 0.10042295786961555, 53.164530002097074, 0.0539611872651875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 214.81250000000003, 112, 1226, 118.5, 614.2000000000006, 1226.0, 1226.0, 0.10066058508965083, 5.6863461878735455, 0.05863675684177415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 625.1176470588236, 114, 1141, 885.0, 1109.0, 1141.0, 1141.0, 0.10042295786961555, 17.38037115143782, 0.05405925655998205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 179.62499999999997, 112, 894, 116.0, 509.0000000000004, 894.0, 894.0, 0.10081026248472096, 1.8780710704474715, 0.05882239436974684], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 940.5, 309, 2970, 603.5, 2526.9000000000015, 2970.0, 2970.0, 0.06944404256919809, 0.012546042846974265, 0.04787841216196666], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e372c0f8-8fa0-4bce-addb-bc4a0fb2851c", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 392.58333333333337, 227, 1448, 240.0, 1154.000000000001, 1448.0, 1448.0, 0.06890730245137729, 6.967650937498206, 0.15350492328320328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b840e3ff-15c0-420c-9f69-3dfd501569fc", 3, 0, 0.0, 365.0, 311, 450, 334.0, 450.0, 450.0, 450.0, 0.020303194369247428, 0.02399768839672442, 0.013019952118299946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b27f20a1-d100-4d5a-b4ee-7c9baf4cd7ac", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 936.4000000000001, 173, 2037, 894.0, 1866.2000000000012, 2030.8999999999999, 2037.0, 0.08969695882461105, 0.05509705771550815, 0.04055633978104972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 143.23529411764704, 113, 345, 116.0, 339.4, 345.0, 345.0, 0.10042058503851424, 0.07462896993584896, 0.050406426474410466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 181.6470588235294, 113, 352, 116.0, 344.8, 352.0, 352.0, 0.10042236465132764, 0.11559417181085152, 0.05231100658652568], "isController": false}, {"data": ["login", 20, 0, 0.0, 3863.4500000000003, 1719, 7671, 3600.5, 5878.1, 7582.399999999999, 7671.0, 0.09217057085843061, 27.693408601645704, 0.17727533135320223], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 124.5, 116, 164, 122.0, 145.10000000000002, 164.0, 164.0, 0.09673109360547014, 0.0783106216786472, 0.034384880930069465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dd6ebef-2523-45eb-ba2c-d92d055ba8c1", 3, 0, 0.0, 564.6666666666667, 223, 1227, 244.0, 1227.0, 1227.0, 1227.0, 0.0898849472674976, 0.040670597884707574, 0.057641063189117936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1024.1176470588234, 229, 2039, 1257.0, 1757.3999999999996, 2039.0, 2039.0, 0.1003524140658666, 70.6854376564317, 0.2105913395128776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e999924f-7301-4319-8a89-b292f266517d", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.7112158964365256, 1.3289079899777283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2e6fdff-dfc6-488b-af47-a89ebf2b8c92", 3, 0, 0.0, 1355.6666666666667, 576, 1942, 1549.0, 1942.0, 1942.0, 1942.0, 0.02028932578570414, 0.023981296200485593, 0.013011058527941785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e630ed46-9d04-4cdf-a1fd-b9463fa6ae42", 1, 0, 0.0, 1028.0, 1028, 1028, 1028.0, 1028.0, 1028.0, 1028.0, 0.9727626459143969, 0.17574325145914396, 0.6706742461089494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 464.64285714285717, 233, 1330, 453.0, 1027.5, 1330.0, 1330.0, 0.09694283834781706, 8.423606392601185, 0.21625502025412874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1397.0, 1178, 1548, 1425.0, 1548.0, 1548.0, 1548.0, 0.08224901712424536, 98.39841886545706, 0.18546189505847907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7158c538-cf20-4690-b9dd-32c3d3845395", 3, 0, 0.0, 635.3333333333333, 256, 1368, 282.0, 1368.0, 1368.0, 1368.0, 0.0188984711136869, 0.02233735306438709, 0.012119136749336979], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1317.7272727272725, 231, 2834, 1179.5, 2593.2, 2806.7, 2834.0, 0.08927158444889, 0.027944922475744507, 0.04027682814002654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 146.95454545454544, 117, 356, 124.5, 288.39999999999986, 354.95, 356.0, 0.11086474501108648, 0.08607175027716187, 0.03940895232815964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 349.18750000000006, 229, 1342, 242.0, 728.8000000000006, 1342.0, 1342.0, 0.10058148672010057, 7.666790674603175, 0.22460170124155274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2e6fdff-dfc6-488b-af47-a89ebf2b8c92", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 438.66666666666663, 226, 1367, 455.5, 767.6000000000009, 1367.0, 1367.0, 0.08338853963503616, 5.664371949658802, 0.18635746118958385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e372c0f8-8fa0-4bce-addb-bc4a0fb2851c", 3, 0, 0.0, 329.6666666666667, 241, 502, 246.0, 502.0, 502.0, 502.0, 0.03914405010438413, 0.02516585252479123, 0.025102141505741127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 118.85714285714285, 113, 125, 120.0, 125.0, 125.0, 125.0, 0.05881315062047874, 0.043707819943539374, 0.029521444745044992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 179.00000000000003, 112, 338, 118.0, 338.0, 338.0, 338.0, 0.05881018592420208, 0.028354911070597427, 0.03283459320154251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 311.2857142857143, 113, 1249, 120.0, 1249.0, 1249.0, 1249.0, 0.05881068001949154, 7.573294450897283, 0.03385224131702317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 226.14285714285717, 112, 884, 116.0, 884.0, 884.0, 884.0, 0.05881413891899613, 2.4840604493820315, 0.03391166798998479], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1317.4821428571427, 895, 2089, 1238.5, 1805.8000000000002, 1916.1999999999998, 2089.0, 0.2502893971154147, 299.4331336232519, 0.4942237900071958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1317.7272727272725, 231, 2834, 1179.5, 2593.2, 2806.7, 2834.0, 0.09402593406217678, 0.029433189231466206, 0.04242185696945867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 114.28571428571428, 112, 122, 113.0, 122.0, 122.0, 122.0, 0.0363538161120113, 0.009798489498940546, 0.02140756944877228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 181.28571428571428, 114, 343, 120.0, 343.0, 343.0, 343.0, 0.03635268334735508, 0.0097981841834668, 0.021371401733503673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 126.27272727272731, 111, 333, 115.0, 125.4, 301.9499999999996, 333.0, 0.10590211756097796, 0.02854393012385734, 0.06225886208174681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 146.63636363636363, 112, 356, 115.5, 336.7, 353.15, 356.0, 0.10590109800183882, 0.02854365532080812, 0.0623616817335047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 129.77272727272728, 113, 337, 119.0, 132.9, 306.6999999999996, 337.0, 0.10589549077746543, 0.0786977231266125, 0.05315457251915746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 183.14285714285717, 113, 357, 120.0, 357.0, 357.0, 357.0, 0.03635268334735508, 0.009727182848803997, 0.020732389721538447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e0cc5a1-d744-45bb-85ee-afb5d8d2f332", 3, 0, 0.0, 742.6666666666667, 318, 1509, 401.0, 1509.0, 1509.0, 1509.0, 0.01835715684354807, 0.021697537922826513, 0.011772004876884668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 147.50000000000003, 113, 340, 117.0, 336.7, 339.55, 340.0, 0.10590262734790938, 0.028337226458327317, 0.06039759215935457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 115.28571428571429, 113, 117, 115.0, 117.0, 117.0, 117.0, 0.036353060927730114, 0.02701628844336193, 0.01824753253598953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 158.7142857142857, 119, 346, 130.0, 346.0, 346.0, 346.0, 0.03520754849839806, 0.027712191493856283, 0.012515183255289934], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 855.5833333333334, 443, 1549, 675.0, 1537.0, 1549.0, 1549.0, 0.06964717899905395, 0.012582742299633772, 0.047406331799160754], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1900.75, 1064, 4641, 1539.0, 4269.000000000004, 4631.75, 4641.0, 0.09240308071871116, 0.047825813262614175, 0.04250180763526656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 301.7142857142857, 229, 471, 239.0, 471.0, 471.0, 471.0, 0.036330419979654964, 0.05630505518331292, 0.0817079660284623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef39eb6f-f38f-483c-bf21-cad558c1e723", 3, 0, 0.0, 858.6666666666666, 487, 1287, 802.0, 1287.0, 1287.0, 1287.0, 0.017699846011339698, 0.024400666620450404, 0.011350487188261463], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1228.2807017543855, 574, 2921, 1006.0, 2096.0000000000005, 2354.9999999999986, 2921.0, 0.26104399278236257, 83.17696245975571, 0.9492228288123872], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b840e3ff-15c0-420c-9f69-3dfd501569fc", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 206.92857142857136, 113, 507, 122.5, 459.5, 496.3, 507.0, 0.25118866062617745, 0.18667438548488383, 0.12142420606441195], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 725.1249999999998, 557, 1036, 676.0, 952.4000000000001, 1028.15, 1036.0, 0.2511289592049975, 73.84025227249286, 0.12630020897516964], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 175.28571428571433, 111, 365, 121.0, 340.3, 354.45, 365.0, 0.25165711717784517, 0.4453151331311089, 0.12238793394000674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c28c628a-46ba-40c8-a659-4b37b3dc7d7f", 3, 0, 0.0, 295.6666666666667, 211, 443, 233.0, 443.0, 443.0, 443.0, 0.0316325562268687, 0.02637076057845401, 0.020285200444964624], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1107.0000000000002, 777, 1583, 1066.5, 1340.8, 1546.35, 1583.0, 0.25088931301129896, 225.75064486393737, 0.12593467469512468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 125.05555555555556, 117, 150, 123.0, 140.10000000000002, 150.0, 150.0, 0.08363107544916858, 0.06247829367052144, 0.02972823385107164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 203.18823529411756, 113, 1225, 127.0, 359.00000000000006, 485.9, 838.0499999999956, 0.7082861142590494, 1.5302772132899474, 0.33985364517365513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 159.85714285714286, 118, 349, 122.0, 349.0, 349.0, 349.0, 0.06530216243446461, 0.050570912900908635, 0.02321287805287609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 127.49999999999999, 116, 176, 122.5, 154.0, 176.0, 176.0, 0.09810791871058164, 0.07961687543798178, 0.03487429922915207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0c6beb4-ab43-4b15-aa1c-e2f21502c3b2", 1, 0, 0.0, 3022.0, 3022, 3022, 3022.0, 3022.0, 3022.0, 3022.0, 0.3309066843150232, 0.10567039626075447, 0.19744529698874919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 462.4285714285714, 227, 1363, 248.0, 1363.0, 1363.0, 1363.0, 0.058752434029409786, 10.11923793371886, 0.12998812099224466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 290.5454545454545, 229, 674, 243.5, 469.4, 643.3999999999996, 674.0, 0.10583486874070938, 0.16402337567529862, 0.2380251003025915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e0cc5a1-d744-45bb-85ee-afb5d8d2f332", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e630ed46-9d04-4cdf-a1fd-b9463fa6ae42", 3, 0, 0.0, 718.0, 225, 1439, 490.0, 1439.0, 1439.0, 1439.0, 0.024065651096190407, 0.024136155933386277, 0.015432725475096061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 175.49999999999997, 114, 477, 123.0, 442.8000000000001, 477.0, 477.0, 0.07347898501028706, 0.060921541282943074, 0.026119482952875476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7158c538-cf20-4690-b9dd-32c3d3845395", 1, 0, 0.0, 1315.0, 1315, 1315, 1315.0, 1315.0, 1315.0, 1315.0, 0.7604562737642585, 0.13738711977186313, 0.5242989543726236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=496482b8-894e-4d7b-a5fd-7883c7a6265a", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 127.29411764705881, 116, 156, 125.0, 149.6, 156.0, 156.0, 0.09925036781018659, 0.0770547289151351, 0.035280404182527265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dd6ebef-2523-45eb-ba2c-d92d055ba8c1", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 140.83333333333331, 112, 337, 116.0, 337.0, 337.0, 337.0, 0.08352048107797101, 0.062069420019859316, 0.04192336647859092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 189.33333333333337, 111, 348, 115.5, 345.3, 348.0, 348.0, 0.08343569657218347, 0.029287595313695042, 0.0471951265441398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7406c67a-d204-4689-a29c-8c55f6252d0f", 3, 0, 0.0, 458.66666666666663, 221, 916, 239.0, 916.0, 916.0, 916.0, 0.028073852949158255, 0.022819144145197968, 0.01800308929356828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e201cb5a-9e7e-4379-94f5-694d00845725", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 241.94444444444446, 113, 1249, 115.5, 455.20000000000124, 1249.0, 1249.0, 0.08352203125580014, 4.196442838739838, 0.04870305945840603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 239.2222222222222, 113, 684, 121.0, 395.1000000000005, 684.0, 684.0, 0.08343453633574058, 1.3841568679370346, 0.04873351878204118], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 53.84615384615385, 0.5477308294209703], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.4694835680751174], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 13, "406/Not Acceptable", 7, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
