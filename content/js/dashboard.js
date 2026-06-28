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

    var data = {"OkPercent": 96.96734059097979, "KoPercent": 3.032659409020218};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7587458745874588, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b16da993-640f-4dd1-83b8-b3c5cdd2b104"], "isController": false}, {"data": [0.16071428571428573, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2c0d26c-861e-4e4f-90e1-31b773e76f2e"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f48493f3-1056-4030-bf44-6cc786c40a32"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2bd8a4b9-9ad3-4ec7-b1f7-8ba436006fea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ddfc218c-778b-47a0-bc0c-92d4436f3d92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9c5555cd-750e-4c9d-bca8-3ad01dce7b25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cf14fb0-f36d-4cd7-b2f7-a607ec73fb7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b204e56c-da27-41f7-8df5-a74ac00d1503"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=771b2772-9b08-47fb-bfbe-848594d3370c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f469fdf9-2559-493d-b0cb-c20ce6f9b766"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66cd4626-e1f7-46b0-b8cf-bdd874549393"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90eecd0c-ebf4-4e4b-aa87-1b4093d91f55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/995deea3-b042-44df-840a-8dfc91756aa6"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cf14fb0-f36d-4cd7-b2f7-a607ec73fb7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c5555cd-750e-4c9d-bca8-3ad01dce7b25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bd8a4b9-9ad3-4ec7-b1f7-8ba436006fea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f510e21-55a5-489a-abbc-dabf183675e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddfc218c-778b-47a0-bc0c-92d4436f3d92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cb66915-463f-443e-bd8e-1814d22f7037"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a5518da-d62c-4f9e-976e-85e3b2fccfb2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1a1ead1-80bb-4119-be7a-4d78bd5e76a4"], "isController": false}, {"data": [0.25471698113207547, 500, 1500, "addBook"], "isController": true}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5982142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b204e56c-da27-41f7-8df5-a74ac00d1503"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1a1ead1-80bb-4119-be7a-4d78bd5e76a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/771b2772-9b08-47fb-bfbe-848594d3370c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cb66915-463f-443e-bd8e-1814d22f7037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90eecd0c-ebf4-4e4b-aa87-1b4093d91f55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2c0d26c-861e-4e4f-90e1-31b773e76f2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f510e21-55a5-489a-abbc-dabf183675e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b16da993-640f-4dd1-83b8-b3c5cdd2b104"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f469fdf9-2559-493d-b0cb-c20ce6f9b766"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1286, 39, 3.032659409020218, 375.41057542768243, 93, 5840, 114.0, 980.3, 1220.549999999999, 1769.7799999999993, 5.067920379266452, 729.3158733899205, 3.6902696409007976], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/b16da993-640f-4dd1-83b8-b3c5cdd2b104", 3, 0, 0.0, 932.0, 820, 1021, 955.0, 1021.0, 1021.0, 1021.0, 0.08107012565869477, 0.036682120659370356, 0.05198832927982705], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1833.3035714285713, 1272, 6261, 1593.5, 2090.8000000000006, 4579.049999999999, 6261.0, 0.25667586421846783, 308.86718427722826, 1.262073219082017], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e2c0d26c-861e-4e4f-90e1-31b773e76f2e", 3, 0, 0.0, 325.0, 177, 570, 228.0, 570.0, 570.0, 570.0, 0.044239305147980475, 0.02844161056877, 0.02836960649138071], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 429.88888888888897, 98, 919, 476.0, 720.1000000000004, 919.0, 919.0, 0.08724565468169877, 0.01853118153639598, 0.05814010288928527], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 429.88888888888897, 98, 919, 476.0, 720.1000000000004, 919.0, 919.0, 0.08641424106692783, 0.01835458733599297, 0.057586052681481904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 123.68750000000001, 95, 295, 99.5, 295.0, 295.0, 295.0, 0.09299568151303975, 0.042343004399858185, 0.05206032658920902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 99.99999999999999, 96, 114, 99.0, 107.0, 114.0, 114.0, 0.09310065926904346, 0.06918906416381061, 0.046732166859656574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 189.375, 94, 803, 98.0, 635.7000000000002, 803.0, 803.0, 0.09285051067780872, 3.4345394832288765, 0.053679201485608175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 219.1875, 95, 1053, 98.0, 942.4000000000001, 1053.0, 1053.0, 0.09258830609693995, 10.435726084006529, 0.053437196194620624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f48493f3-1056-4030-bf44-6cc786c40a32", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 301.99999999999994, 97, 1176, 192.5, 1036.5000000000002, 1176.0, 1176.0, 0.08713500116180001, 0.125809667204806, 0.05630777988488499], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 138.04999999999998, 95, 310, 99.0, 299.7, 309.5, 310.0, 0.10279816608071712, 0.07639590272209543, 0.051599860708484956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 135.94999999999996, 93, 302, 98.0, 288.8, 301.34999999999997, 302.0, 0.10269101813009925, 0.03518972486508968, 0.05813474922853373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 808.6666666666666, 742, 899, 792.5, 899.0, 899.0, 899.0, 0.03823068394693581, 11.241090458577053, 0.02180343693848683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bd8a4b9-9ad3-4ec7-b1f7-8ba436006fea", 3, 0, 0.0, 488.66666666666663, 260, 902, 304.0, 902.0, 902.0, 902.0, 0.028494358117092815, 0.028577837681888985, 0.018272749183161734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 898.6666666666666, 670, 1091, 896.5, 1091.0, 1091.0, 1091.0, 0.038217534204693114, 34.38820445664221, 0.02175861566536727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddfc218c-778b-47a0-bc0c-92d4436f3d92", 3, 0, 0.0, 603.0, 271, 971, 567.0, 971.0, 971.0, 971.0, 0.04575611988103409, 0.029714667696179364, 0.029342303439335013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 166.83333333333331, 96, 303, 101.5, 303.0, 303.0, 303.0, 0.03835532371893219, 0.06787094392451673, 0.02123776225452593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c5555cd-750e-4c9d-bca8-3ad01dce7b25", 3, 0, 0.0, 485.6666666666667, 216, 627, 614.0, 627.0, 627.0, 627.0, 0.07466772860769576, 0.03466021516750461, 0.047882625441784066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 99.625, 95, 106, 100.0, 106.0, 106.0, 106.0, 0.07192950908110053, 0.05345542618234131, 0.036105241862974286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 146.75, 93, 298, 100.5, 298.0, 298.0, 298.0, 0.07179910610112904, 0.032691731659815836, 0.040194177316867405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 283.625, 95, 885, 200.5, 885.0, 885.0, 885.0, 0.07179588430093245, 8.092190192345662, 0.04143688244321394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 269.0, 96, 778, 197.0, 778.0, 778.0, 778.0, 0.07192756893807935, 2.66060007260189, 0.041583125792327126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 98.5, 96, 103, 98.0, 103.0, 103.0, 103.0, 0.03840540748137338, 0.02854151864582533, 0.021565536427528995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 573.2608695652175, 94, 1362, 168.0, 1279.2, 1350.3999999999999, 1362.0, 0.11036309458117205, 43.19285943280567, 0.06075780758914219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 205.6, 94, 1078, 99.0, 307.20000000000005, 1039.4999999999995, 1078.0, 0.10280080801435099, 4.651340016563781, 0.059993909052125156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 362.7391304347826, 94, 863, 105.0, 782.2, 847.3999999999997, 863.0, 0.11035938774530973, 14.125214421093037, 0.060863539717384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 200.15, 95, 783, 100.5, 302.6, 758.9999999999997, 783.0, 0.10269576379974327, 1.5360939505776636, 0.060032894736842105], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 432.94444444444446, 97, 1056, 425.0, 1033.5, 1056.0, 1056.0, 0.0865571878531413, 0.018384949568416242, 0.05796307344136952], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 409.375, 195, 992, 396.0, 992.0, 992.0, 992.0, 0.07173343854237653, 10.824542601256232, 0.159035975440264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cf14fb0-f36d-4cd7-b2f7-a607ec73fb7d", 3, 0, 0.0, 291.0, 192, 459, 222.0, 459.0, 459.0, 459.0, 0.01885665797165216, 0.02599542529620667, 0.012092322983123292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b204e56c-da27-41f7-8df5-a74ac00d1503", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 668.3478260869566, 143, 1216, 643.0, 1171.0, 1212.6, 1216.0, 0.09907302112409111, 0.0608563772334505, 0.044795711699662295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 108.08695652173914, 95, 287, 100.0, 105.80000000000001, 250.9999999999995, 287.0, 0.11039752709539306, 0.08204347472616613, 0.05541438371780472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 151.34782608695647, 94, 295, 100.0, 292.6, 294.6, 295.0, 0.11037156828401004, 0.1016082007274926, 0.058916073219538644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=771b2772-9b08-47fb-bfbe-848594d3370c", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f469fdf9-2559-493d-b0cb-c20ce6f9b766", 3, 0, 0.0, 375.33333333333337, 193, 703, 230.0, 703.0, 703.0, 703.0, 0.04059045583081898, 0.026571421443937815, 0.026029686844633262], "isController": false}, {"data": ["login", 23, 0, 0.0, 2720.739130434782, 1636, 4111, 2616.0, 3683.8, 4027.799999999999, 4111.0, 0.10144179666653436, 31.797799484852096, 0.19693543091813648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 114.5, 97, 288, 104.5, 120.9, 279.64999999999986, 288.0, 0.10198046054375982, 0.08256035331130555, 0.03625086683391462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66cd4626-e1f7-46b0-b8cf-bdd874549393", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90eecd0c-ebf4-4e4b-aa87-1b4093d91f55", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/995deea3-b042-44df-840a-8dfc91756aa6", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 683.7391304347825, 194, 1462, 275.0, 1378.0, 1449.6, 1462.0, 0.11030487307745801, 57.47183160492391, 0.2358075770455559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 339.5625, 195, 1150, 200.5, 1040.1000000000001, 1150.0, 1150.0, 0.0925331528936852, 13.963209848563713, 0.20514979527039923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 9, 60.0, 475.0, 95, 1190, 103.0, 1184.0, 1190.0, 1190.0, 0.08701554097561824, 41.654305474582756, 0.11297857641124705], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 1002.576923076923, 187, 1693, 947.0, 1633.6, 1675.1499999999999, 1693.0, 0.10631685694657986, 0.03346361407798751, 0.047967175692695214], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cf14fb0-f36d-4cd7-b2f7-a607ec73fb7d", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c5555cd-750e-4c9d-bca8-3ad01dce7b25", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 104.53846153846153, 99, 134, 102.0, 122.39999999999999, 134.0, 134.0, 0.061250547721244046, 0.04755291546717678, 0.02177265563528597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 394.74999999999994, 196, 1176, 384.5, 611.2, 1147.7999999999997, 1176.0, 0.1026388446971641, 6.2907037191826864, 0.2295241117890977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bd8a4b9-9ad3-4ec7-b1f7-8ba436006fea", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 315.5, 194, 402, 390.5, 401.4, 402.0, 402.0, 0.0723091941140316, 0.11206512798727358, 0.1626250723091941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 98.12500000000001, 95, 103, 98.0, 103.0, 103.0, 103.0, 0.047909929332854234, 0.03560493771709187, 0.02404853874715535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 98.0, 94, 103, 97.5, 103.0, 103.0, 103.0, 0.047909929332854234, 0.012819649059767638, 0.027323631572643434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f510e21-55a5-489a-abbc-dabf183675e6", 3, 0, 0.0, 326.6666666666667, 209, 387, 384.0, 387.0, 387.0, 387.0, 0.06914672935970129, 0.031287094339187756, 0.04434214089798552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 97.62500000000001, 94, 102, 97.0, 102.0, 102.0, 102.0, 0.047909929332854234, 0.012913223140495868, 0.02816579829919751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 98.75, 96, 103, 98.5, 103.0, 103.0, 103.0, 0.04791021625473862, 0.012913300474910018, 0.028212754298444713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 102.2, 97, 109, 102.0, 109.0, 109.0, 109.0, 0.05603747786519624, 0.016526678042274673, 0.034640354969403535], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1262.2857142857147, 752, 5840, 1034.0, 1622.3, 2346.2499999999964, 5840.0, 0.253378760525399, 303.12908629809107, 0.5003240759593327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 1002.576923076923, 187, 1693, 947.0, 1633.6, 1675.1499999999999, 1693.0, 0.1050836223132947, 0.0330754490304015, 0.047410774910881005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 153.22222222222223, 93, 403, 102.0, 403.0, 403.0, 403.0, 0.05697536764938625, 0.015356642061748638, 0.03355092450447257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 141.22222222222223, 95, 296, 99.0, 296.0, 296.0, 296.0, 0.05697608903463513, 0.015356836497616499, 0.033495708592627293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddfc218c-778b-47a0-bc0c-92d4436f3d92", 1, 0, 0.0, 1056.0, 1056, 1056, 1056.0, 1056.0, 1056.0, 1056.0, 0.946969696969697, 0.1710833925189394, 0.6528912168560606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cb66915-463f-443e-bd8e-1814d22f7037", 3, 0, 0.0, 338.3333333333333, 190, 431, 394.0, 431.0, 431.0, 431.0, 0.06644959797993223, 0.030066712627638603, 0.04261253516291227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 234.61538461538458, 95, 1079, 100.0, 768.9999999999998, 1079.0, 1079.0, 0.06132856543050293, 4.260146965946134, 0.03564907146193147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 210.6153846153846, 96, 587, 99.0, 476.5999999999999, 587.0, 587.0, 0.06132885475440153, 1.4023907786169871, 0.03570913109986224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 99.53846153846155, 95, 108, 100.0, 106.4, 108.0, 108.0, 0.06132798679089515, 0.045576755808467984, 0.030783774619648544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 139.88888888888889, 96, 288, 98.0, 288.0, 288.0, 288.0, 0.05690799873537781, 0.015227335599114765, 0.03245534302877015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 126.30769230769229, 94, 293, 98.0, 288.6, 293.0, 293.0, 0.06132798679089515, 0.023495547824035855, 0.034579918032786885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 121.11111111111111, 97, 281, 101.0, 281.0, 281.0, 281.0, 0.056974646282404326, 0.04234150959073212, 0.028598601747222487], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 471.1764705882353, 95, 971, 459.0, 915.8, 971.0, 971.0, 0.08236952908855694, 0.016565700904126714, 0.056047051473687784], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 132.11111111111114, 102, 296, 110.0, 296.0, 296.0, 296.0, 0.06238649124509573, 0.04910499213237027, 0.022176448059780123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1539.4782608695652, 1026, 2338, 1450.0, 2189.6000000000004, 2316.3999999999996, 2338.0, 0.10137562312950957, 0.05246980494007819, 0.04662882665429591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 319.3333333333333, 200, 570, 206.0, 570.0, 570.0, 570.0, 0.05687203791469194, 0.0881405509478673, 0.1279065462085308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a5518da-d62c-4f9e-976e-85e3b2fccfb2", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1a1ead1-80bb-4119-be7a-4d78bd5e76a4", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 0.24024476396276595, 0.9168259640957447], "isController": false}, {"data": ["addBook", 53, 13, 24.528301886792452, 1030.6981132075468, 499, 2020, 805.0, 1811.0, 1900.2999999999997, 2020.0, 0.247328386765598, 84.74527709966634, 0.8960868959704139], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 237.6428571428571, 96, 3592, 103.0, 395.20000000000005, 436.3499999999997, 3592.0, 0.2542449832016707, 0.1889457345863979, 0.12290162762190139], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 623.5714285714287, 465, 900, 575.5, 845.3, 861.15, 900.0, 0.2543454465352246, 74.78600634501052, 0.12791787594300846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b204e56c-da27-41f7-8df5-a74ac00d1503", 3, 0, 0.0, 611.6666666666666, 200, 1176, 459.0, 1176.0, 1176.0, 1176.0, 0.018662403344302678, 0.025727629610391226, 0.011967752144621185], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 162.60714285714283, 94, 370, 105.0, 302.20000000000005, 309.75, 370.0, 0.25490927960816806, 0.45106993618164104, 0.12396955199694108], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1020.875, 653, 5720, 878.5, 1272.1000000000001, 1317.75, 5720.0, 0.2541492128181971, 228.6839084404769, 0.1275709915903841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 102.91666666666666, 100, 106, 103.0, 105.7, 106.0, 106.0, 0.07543706348657535, 0.05635679059299818, 0.026815518661243577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 13, 8.024691358024691, 155.69135802469143, 96, 760, 105.5, 298.0, 351.3499999999998, 560.2900000000014, 0.6896581083784945, 1.594248186188532, 0.3267112274850042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 127.875, 99, 288, 103.5, 288.0, 288.0, 288.0, 0.04833807650709059, 0.03743368620129183, 0.017182675633379857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 119.0, 99, 302, 104.0, 190.0000000000001, 302.0, 302.0, 0.0981679408047317, 0.07966558477415239, 0.03489563520793197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1a1ead1-80bb-4119-be7a-4d78bd5e76a4", 3, 0, 0.0, 302.0, 197, 398, 311.0, 398.0, 398.0, 398.0, 0.035150620408450205, 0.029303625932956053, 0.0225412507176585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/771b2772-9b08-47fb-bfbe-848594d3370c", 3, 0, 0.0, 315.0, 191, 471, 283.0, 471.0, 471.0, 471.0, 0.016787255115915996, 0.023142586398406332, 0.01076526451118311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 198.25, 194, 207, 198.0, 207.0, 207.0, 207.0, 0.04788096791376638, 0.07420614851479224, 0.10768541904824606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 395.7692307692308, 196, 1188, 394.0, 875.5999999999997, 1188.0, 1188.0, 0.06129906872568666, 5.728847400683721, 0.1366565852292821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cb66915-463f-443e-bd8e-1814d22f7037", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90eecd0c-ebf4-4e4b-aa87-1b4093d91f55", 3, 0, 0.0, 354.3333333333333, 245, 417, 401.0, 417.0, 417.0, 417.0, 0.04456791407306167, 0.02865287444475807, 0.02858033552211311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 103.62500000000001, 99, 110, 103.5, 110.0, 110.0, 110.0, 0.06818607981180641, 0.05653318531271841, 0.024238020558103066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2c0d26c-861e-4e4f-90e1-31b773e76f2e", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f510e21-55a5-489a-abbc-dabf183675e6", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b16da993-640f-4dd1-83b8-b3c5cdd2b104", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.6103515625, 2.3292335304054057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 253.6086956521739, 96, 3489, 106.0, 121.0, 2815.7999999999906, 3489.0, 0.10388531061707874, 0.08065314642634532, 0.03692798150841471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f469fdf9-2559-493d-b0cb-c20ce6f9b766", 1, 0, 0.0, 1031.0, 1031, 1031, 1031.0, 1031.0, 1031.0, 1031.0, 0.9699321047526673, 0.17523187439379245, 0.6687227206595538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 99.91666666666666, 94, 105, 100.0, 104.7, 105.0, 105.0, 0.07235540977280401, 0.05377194027060923, 0.03631902404611451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 114.08333333333334, 95, 286, 98.5, 231.7000000000002, 286.0, 286.0, 0.07235759121578843, 0.01936130858703714, 0.04126643874025434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 180.66666666666669, 95, 302, 104.5, 301.4, 302.0, 302.0, 0.0723541009701479, 0.019501691277110177, 0.04253629764065336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 194.08333333333331, 95, 301, 193.0, 298.6, 301.0, 301.0, 0.07235497349999095, 0.019501926451169438, 0.042607469746576705], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 17.94871794871795, 0.5443234836702955], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 12.820512820512821, 0.38880248833592534], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.256410256410257, 0.3110419906687403], "isController": false}, {"data": ["401/Unauthorized", 23, 58.97435897435897, 1.7884914463452566], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1286, 39, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
