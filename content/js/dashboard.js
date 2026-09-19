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

    var data = {"OkPercent": 98.6322188449848, "KoPercent": 1.3677811550151975};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7967320261437908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3135593220338983, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad22ea4a-8450-462d-95c9-7ffb6d8ced07"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff35db20-52d6-4583-b9b7-f22bdc2f36dd"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71539303-a5e8-4b35-bcb6-bb2559f5b66f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea56d1ec-40c3-4784-82b4-96c042b9215c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7bfd141-caf9-42b2-8e0c-5319b38b3276"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c3cfdc3-a809-4472-8c8e-239d0e6a42e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e44f1848-7fcb-47f3-8929-b625366e306b"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c3cfdc3-a809-4472-8c8e-239d0e6a42e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66ee6866-2a4c-4d65-baac-fa14ab8cd569"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc168d0a-dfe0-4c14-9cae-834bc190077a"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d95be53b-8f2a-4d59-bb86-a0220bcc4a50"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d582d806-0e36-4951-9a7a-9871f8777dc0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c70d64f9-beba-4c10-af8e-8af8fbbdc305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/835ad7c4-67f4-4ce8-a2cb-1ff18824ca48"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/71539303-a5e8-4b35-bcb6-bb2559f5b66f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff35db20-52d6-4583-b9b7-f22bdc2f36dd"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e44f1848-7fcb-47f3-8929-b625366e306b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad22ea4a-8450-462d-95c9-7ffb6d8ced07"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea56d1ec-40c3-4784-82b4-96c042b9215c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/433468ba-8e64-4322-b426-9031afc7822e"], "isController": false}, {"data": [0.6864406779661016, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9378698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=433468ba-8e64-4322-b426-9031afc7822e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c70d64f9-beba-4c10-af8e-8af8fbbdc305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7bfd141-caf9-42b2-8e0c-5319b38b3276"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffd2263c-73f1-4cef-b0df-3d079c4e75d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66ee6866-2a4c-4d65-baac-fa14ab8cd569"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc168d0a-dfe0-4c14-9cae-834bc190077a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d582d806-0e36-4951-9a7a-9871f8777dc0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d95be53b-8f2a-4d59-bb86-a0220bcc4a50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b809853b-b343-48f8-950c-b93ac9058ad2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 18, 1.3677811550151975, 328.5083586626145, 81, 2125, 102.0, 920.3, 1087.1499999999999, 1533.1099999999988, 5.089944265883837, 752.9263636619655, 3.7217996516134275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1450.2203389830502, 1057, 1878, 1414.0, 1771.0, 1834.0, 1878.0, 0.25739913444087675, 309.73857031277265, 1.265629533115053], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad22ea4a-8450-462d-95c9-7ffb6d8ced07", 2, 0, 0.0, 327.5, 253, 402, 327.5, 402.0, 402.0, 402.0, 0.013436616122595686, 0.02296296700638911, 0.008351959142609524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff35db20-52d6-4583-b9b7-f22bdc2f36dd", 1, 0, 0.0, 697.0, 697, 697, 697.0, 697.0, 697.0, 697.0, 1.4347202295552368, 0.25920238522238165, 0.9891723457675754], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 602.0714285714287, 90, 1011, 505.0, 1009.5, 1011.0, 1011.0, 0.07436365954191987, 0.014041742911549738, 0.05028987718044873], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 602.0714285714287, 90, 1011, 505.0, 1009.5, 1011.0, 1011.0, 0.07537580221389499, 0.014232861090472499, 0.05097435843078348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71539303-a5e8-4b35-bcb6-bb2559f5b66f", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 124.94444444444444, 83, 278, 86.5, 259.1, 278.0, 278.0, 0.10515308536677981, 0.04568499932818862, 0.058988872758924865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 99.05555555555556, 85, 257, 90.0, 119.30000000000021, 257.0, 257.0, 0.10514080105608094, 0.07813686484734139, 0.05277575365510312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 161.66666666666663, 84, 665, 87.5, 535.4000000000002, 665.0, 665.0, 0.1051493997721763, 3.4604603572158776, 0.06091500058416333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea56d1ec-40c3-4784-82b4-96c042b9215c", 3, 0, 0.0, 325.0, 178, 468, 329.0, 468.0, 468.0, 468.0, 0.030291403299743534, 0.02525269656596458, 0.01942515120458814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 189.27777777777777, 83, 941, 86.0, 776.3000000000003, 941.0, 941.0, 0.1051493997721763, 10.53781590457692, 0.06081231562344831], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 268.07142857142856, 89, 578, 246.0, 470.5, 578.0, 578.0, 0.07426149594479188, 0.1460779984405086, 0.04800371672156713], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 98.93333333333334, 84, 257, 87.0, 158.00000000000006, 257.0, 257.0, 0.11276160692807313, 0.08380037389869498, 0.056601040977567955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 657.0, 502, 748, 669.0, 748.0, 748.0, 748.0, 0.03114844309698587, 9.15867649616355, 0.017764346453749753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 118.86666666666666, 81, 255, 86.0, 253.8, 255.0, 255.0, 0.11261768548132799, 0.06396332605072301, 0.062335648565250694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 908.0, 766, 1104, 879.0, 1104.0, 1104.0, 1104.0, 0.031107585584744836, 27.990660190456193, 0.01771066640225219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 204.16666666666666, 84, 289, 252.0, 289.0, 289.0, 289.0, 0.031242189452636845, 0.05528403055486129, 0.017299142011372157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7bfd141-caf9-42b2-8e0c-5319b38b3276", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c3cfdc3-a809-4472-8c8e-239d0e6a42e9", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 98.29411764705881, 86, 260, 89.0, 124.79999999999988, 260.0, 260.0, 0.07891267616094472, 0.05864506499851459, 0.03961046440109921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 105.47058823529412, 83, 258, 85.0, 251.6, 258.0, 258.0, 0.07891377509574098, 0.021115599976790064, 0.045005512359289776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 115.88235294117646, 82, 264, 86.0, 259.2, 264.0, 264.0, 0.07891560672175287, 0.02127022212422245, 0.04639374535790549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 135.8235294117647, 84, 261, 88.0, 257.8, 261.0, 261.0, 0.07885228184588554, 0.021253154091273836, 0.04643352143854393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 114.66666666666666, 84, 257, 86.0, 257.0, 257.0, 257.0, 0.031242189452636845, 0.023218072435016245, 0.017543221616470882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 560.5625, 83, 1209, 790.0, 1087.9, 1209.0, 1209.0, 0.11938338481741803, 60.43860365509021, 0.0644133985465073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 261.9333333333333, 83, 921, 89.0, 893.4, 921.0, 921.0, 0.11276415002142519, 20.31739085135054, 0.06435485280519618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 415.875, 84, 787, 557.0, 731.7, 787.0, 787.0, 0.11938605720084466, 19.7597769486043, 0.06453142837955812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 268.2666666666667, 84, 701, 253.0, 677.6, 701.0, 701.0, 0.11262022208707795, 6.647100662770007, 0.06438269336892133], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 548.8571428571428, 90, 1243, 478.0, 1078.5, 1243.0, 1243.0, 0.07560497480734232, 0.014276134682162087, 0.0517410998768719], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e44f1848-7fcb-47f3-8929-b625366e306b", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 256.7647058823529, 173, 522, 179.0, 385.9999999999999, 522.0, 522.0, 0.07881828213235907, 0.12215294310942759, 0.17726416381916305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c3cfdc3-a809-4472-8c8e-239d0e6a42e9", 3, 0, 0.0, 377.0, 225, 598, 308.0, 598.0, 598.0, 598.0, 0.03515968356284793, 0.028967825227072957, 0.022547062701435687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66ee6866-2a4c-4d65-baac-fa14ab8cd569", 3, 0, 0.0, 334.0, 214, 487, 301.0, 487.0, 487.0, 487.0, 0.031208064163779917, 0.025712112759937168, 0.020012983855028137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 712.4545454545455, 164, 1548, 764.5, 1156.4999999999998, 1501.1999999999994, 1548.0, 0.09318282894597514, 0.05723828067091637, 0.04213247050975243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 88.75, 83, 99, 88.0, 94.80000000000001, 99.0, 99.0, 0.11938338481741803, 0.08872144125591322, 0.05992486308218054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 169.25, 84, 365, 95.5, 299.9000000000001, 365.0, 365.0, 0.11938249404952882, 0.1328042807950874, 0.062445555053983276], "isController": false}, {"data": ["login", 22, 0, 0.0, 2755.772727272727, 1692, 3947, 2863.5, 3521.2999999999997, 3896.5999999999995, 3947.0, 0.09288265543067999, 30.432139522942016, 0.18214532810798031], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 94.19999999999999, 87, 112, 93.0, 104.80000000000001, 112.0, 112.0, 0.11179513169466514, 0.0905060197020287, 0.039739675719587995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc168d0a-dfe0-4c14-9cae-834bc190077a", 3, 0, 0.0, 411.66666666666663, 208, 757, 270.0, 757.0, 757.0, 757.0, 0.032491092025602984, 0.03279781131881342, 0.02083575888360608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 651.7499999999999, 173, 1296, 876.0, 1178.4, 1296.0, 1296.0, 0.11930326890956812, 80.36549704025367, 0.2511456142999881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d95be53b-8f2a-4d59-bb86-a0220bcc4a50", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d582d806-0e36-4951-9a7a-9871f8777dc0", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c70d64f9-beba-4c10-af8e-8af8fbbdc305", 3, 0, 0.0, 452.3333333333333, 327, 667, 363.0, 667.0, 667.0, 667.0, 0.05999040153575428, 0.038568047862342025, 0.03847040723484242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/835ad7c4-67f4-4ce8-a2cb-1ff18824ca48", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7788681402439025, 1.4553163109756098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 789.625, 86, 1190, 967.5, 1190.0, 1190.0, 1190.0, 0.04145765100949381, 37.201096004259774, 0.0769790441290784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 309.3333333333333, 171, 1032, 180.0, 866.4000000000003, 1032.0, 1032.0, 0.1050849436627941, 14.113446129371242, 0.23335106033627184], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1018.0434782608696, 135, 1988, 1067.0, 1704.0000000000005, 1953.1999999999996, 1988.0, 0.1033508131012883, 0.032402445819459606, 0.0466289801296828], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 91.66666666666666, 87, 108, 90.0, 104.4, 108.0, 108.0, 0.08019246190858059, 0.06225879611066559, 0.028505914194065757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 416.6, 174, 1008, 344.0, 982.8000000000001, 1008.0, 1008.0, 0.11254501800720287, 27.06813194027611, 0.2473572436787215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71539303-a5e8-4b35-bcb6-bb2559f5b66f", 3, 0, 0.0, 784.3333333333334, 183, 1205, 965.0, 1205.0, 1205.0, 1205.0, 0.05996522017230007, 0.02713270053369046, 0.03845425902976273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff35db20-52d6-4583-b9b7-f22bdc2f36dd", 3, 0, 0.0, 392.0, 186, 495, 495.0, 495.0, 495.0, 495.0, 0.024182627200619075, 0.024253474741245888, 0.015507739448313665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 246.2105263157895, 172, 591, 182.0, 352.0, 591.0, 591.0, 0.09919236532026082, 0.15372879273755266, 0.22308595442632878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e44f1848-7fcb-47f3-8929-b625366e306b", 3, 0, 0.0, 422.66666666666663, 195, 773, 300.0, 773.0, 773.0, 773.0, 0.020474880733819725, 0.024200615867350075, 0.01313005047058101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 87.6, 85, 91, 87.0, 91.0, 91.0, 91.0, 0.023481895458601416, 0.01745090082421453, 0.01178681080636829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 85.8, 83, 89, 85.0, 89.0, 89.0, 89.0, 0.02348255715654412, 0.006283418614153407, 0.013392395878341568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 121.6, 85, 264, 86.0, 264.0, 264.0, 264.0, 0.023482446870963954, 0.006329253258189503, 0.013805110367500293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 136.6, 84, 342, 86.0, 342.0, 342.0, 342.0, 0.02348255715654412, 0.006329282983599782, 0.013828107388082132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 981.152542372881, 676, 1501, 921.0, 1411.0, 1462.0, 1501.0, 0.2569798336164467, 307.43722165055095, 0.5074347886449758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad22ea4a-8450-462d-95c9-7ffb6d8ced07", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1018.0434782608696, 135, 1988, 1067.0, 1704.0000000000005, 1953.1999999999996, 1988.0, 0.09763054902327002, 0.030609034221629836, 0.044048157860108156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 162.2222222222222, 84, 265, 88.0, 265.0, 265.0, 265.0, 0.08091851505533927, 0.021810068511009414, 0.04765025837731404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 143.44444444444446, 85, 259, 88.0, 259.0, 259.0, 259.0, 0.08091706001348617, 0.021809676331759946, 0.0475703809844909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 221.53333333333333, 84, 1012, 88.0, 1010.2, 1012.0, 1012.0, 0.0778694907335306, 9.360470445283704, 0.04488648899444531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 164.33333333333331, 84, 501, 87.0, 499.2, 501.0, 501.0, 0.0780778279789294, 3.0792350064544336, 0.045082829189135726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 111.26666666666667, 84, 266, 87.0, 266.0, 266.0, 266.0, 0.07824522052111317, 0.058149035953678825, 0.03927543295688688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 104.88888888888889, 83, 263, 85.0, 263.0, 263.0, 263.0, 0.08091560502396002, 0.021651245875551797, 0.046147180990227195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 131.4, 81, 263, 86.0, 259.4, 263.0, 263.0, 0.07817385866166354, 0.03657274403272879, 0.0437081444131749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 146.0, 86, 261, 90.0, 261.0, 261.0, 261.0, 0.08078994614003591, 0.060040184582585275, 0.04055276593357271], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 622.0769230769231, 86, 1205, 598.0, 1092.1999999999998, 1205.0, 1205.0, 0.08673837038618591, 0.016250412841282126, 0.05903317575862713], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 90.88888888888889, 88, 95, 90.0, 95.0, 95.0, 95.0, 0.07906944053978072, 0.062236297924866464, 0.028106715191875176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1475.4545454545453, 924, 2125, 1429.0, 2073.8, 2119.75, 2125.0, 0.09210763195464956, 0.0476728954452776, 0.04236591274476557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 330.44444444444446, 174, 525, 340.0, 525.0, 525.0, 525.0, 0.08072545273524742, 0.12510868504964615, 0.18155343520436992], "isController": false}, {"data": ["addBook", 55, 7, 12.727272727272727, 962.127272727273, 432, 2725, 832.0, 1575.9999999999998, 1821.3999999999987, 2725.0, 0.2548916015534485, 89.7436851329839, 0.9239730040829001], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea56d1ec-40c3-4784-82b4-96c042b9215c", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 139.72881355932205, 85, 358, 89.0, 345.0, 356.0, 358.0, 0.25791785971891323, 0.1916752844200127, 0.12467709039146685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/433468ba-8e64-4322-b426-9031afc7822e", 3, 0, 0.0, 321.3333333333333, 177, 557, 230.0, 557.0, 557.0, 557.0, 0.06908781060728186, 0.031260435138060476, 0.044304357713654055], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 533.9322033898305, 414, 854, 506.0, 700.0, 756.0, 854.0, 0.25786713286713286, 75.82149905758304, 0.1296890365493881], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 114.91525423728814, 83, 272, 88.0, 255.0, 266.0, 272.0, 0.25825881034611053, 0.456997035495266, 0.12559852300035457], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 839.9661016949153, 588, 1170, 831.0, 1097.0, 1144.0, 1170.0, 0.2574159798604718, 231.62335116747965, 0.1292107555159009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 111.10526315789473, 84, 255, 92.0, 253.0, 255.0, 255.0, 0.09912612495108908, 0.07405418514412417, 0.035236239728707444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 167.88757396449694, 84, 1536, 93.0, 300.0, 401.0, 1449.2000000000014, 0.7082984073763622, 1.6501696091785416, 0.33593995573134955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 88.6, 87, 93, 88.0, 93.0, 93.0, 93.0, 0.02336612379372386, 0.018095054851975604, 0.008305926817300278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 108.83333333333333, 86, 258, 91.0, 256.2, 258.0, 258.0, 0.10293184196531197, 0.08353160221989674, 0.03658905319860699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=433468ba-8e64-4322-b426-9031afc7822e", 1, 0, 0.0, 1243.0, 1243, 1243, 1243.0, 1243.0, 1243.0, 1243.0, 0.8045052292839903, 0.14534518302493965, 0.5546686444086886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c70d64f9-beba-4c10-af8e-8af8fbbdc305", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7bfd141-caf9-42b2-8e0c-5319b38b3276", 3, 0, 0.0, 338.0, 291, 406, 317.0, 406.0, 406.0, 406.0, 0.05327555894940598, 0.024105803040258562, 0.034164339560654226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffd2263c-73f1-4cef-b0df-3d079c4e75d6", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 226.0, 171, 428, 178.0, 428.0, 428.0, 428.0, 0.023472525409008755, 0.036377829906344625, 0.05279025978217497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66ee6866-2a4c-4d65-baac-fa14ab8cd569", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 356.66666666666674, 169, 1097, 182.0, 1096.4, 1097.0, 1097.0, 0.07783393351944291, 12.52006960137351, 0.17239506850683384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc168d0a-dfe0-4c14-9cae-834bc190077a", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 100.82352941176471, 87, 260, 91.0, 129.59999999999988, 260.0, 260.0, 0.07896399241945672, 0.06546916949620972, 0.028069231680353756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d582d806-0e36-4951-9a7a-9871f8777dc0", 3, 0, 0.0, 512.3333333333334, 294, 665, 578.0, 665.0, 665.0, 665.0, 0.018793459875963165, 0.025908301619369793, 0.012051795558478982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d95be53b-8f2a-4d59-bb86-a0220bcc4a50", 3, 0, 0.0, 789.0, 239, 1205, 923.0, 1205.0, 1205.0, 1205.0, 0.02272847802534983, 0.022795065363314722, 0.014575228421204156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 102.75, 84, 262, 90.5, 163.3000000000001, 262.0, 262.0, 0.1212020210437009, 0.09409727219701389, 0.04308353091787806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b809853b-b343-48f8-950c-b93ac9058ad2", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 97.94736842105262, 84, 256, 87.0, 127.0, 256.0, 256.0, 0.09924106699816665, 0.0737523945171922, 0.04981436370806412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 118.00000000000001, 83, 334, 87.0, 264.0, 334.0, 334.0, 0.099236920312753, 0.026553629068060858, 0.05659605611586693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 114.78947368421053, 83, 263, 87.0, 262.0, 263.0, 263.0, 0.09924003029432504, 0.026748289415267294, 0.058342283434749675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 132.26315789473685, 84, 266, 88.0, 266.0, 266.0, 266.0, 0.0992415853582099, 0.02674870855358001, 0.05844011325293024], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5319148936170213], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07598784194528875], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07598784194528875], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.6838905775075987], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
