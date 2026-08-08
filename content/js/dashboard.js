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

    var data = {"OkPercent": 98.81481481481481, "KoPercent": 1.1851851851851851};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8081358103779629, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38333333333333336, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f3e23115-ea65-4c16-af0a-e083b4d3b2e2"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36442041-f61a-47b1-8114-81d75aa810ac"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38435e9b-490e-4119-aa2a-ffb81cf44a13"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eda2bbcd-c33a-4d8d-aa1a-83070de03ade"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4064d6b1-46fa-478d-bab7-eccc65f4bb48"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab428234-f9ff-4586-aa32-27ea1d3c9514"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fcfb3b7-bee9-46be-a96a-7857fcd85153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e25e0c9-91e2-4bd2-a211-4401bbba6835"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/555b8806-2e9c-4142-8834-84e05b874c2a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c0b6295d-7b8b-4aac-af26-588cb70e5f98"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc6d0fca-8d8b-45c4-83ed-39c90f7c4c30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1f5ee05-283b-4efb-9254-79904b4b61c1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0f1f8b8-6f86-4819-bd1e-4d3d2ccbd804"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8e6c051-d2d0-4044-9184-164f6574d46a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/eda2bbcd-c33a-4d8d-aa1a-83070de03ade"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3e23115-ea65-4c16-af0a-e083b4d3b2e2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0b6295d-7b8b-4aac-af26-588cb70e5f98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36442041-f61a-47b1-8114-81d75aa810ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c034f0b7-01a9-4d7d-9469-b33c29a2375f"], "isController": false}, {"data": [0.3770491803278688, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9478021978021978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc6d0fca-8d8b-45c4-83ed-39c90f7c4c30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/146df1b5-f385-4f98-842c-088e49752700"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab428234-f9ff-4586-aa32-27ea1d3c9514"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=555b8806-2e9c-4142-8834-84e05b874c2a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38435e9b-490e-4119-aa2a-ffb81cf44a13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fcfb3b7-bee9-46be-a96a-7857fcd85153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5e5307bc-65c6-49e2-b49e-dc1f0f482894"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0f1f8b8-6f86-4819-bd1e-4d3d2ccbd804"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1350, 16, 1.1851851851851851, 321.1044444444445, 77, 5061, 95.0, 852.0, 1077.7000000000003, 2102.3400000000006, 5.397819281010472, 768.8638282321442, 3.946620409104722], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1333.0833333333342, 959, 1796, 1347.0, 1600.1, 1635.1, 1796.0, 0.26155871557233407, 314.7436748427378, 1.2860821610417013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f3e23115-ea65-4c16-af0a-e083b4d3b2e2", 3, 0, 0.0, 583.3333333333334, 237, 823, 690.0, 823.0, 823.0, 823.0, 0.07600901973700878, 0.034392102029440826, 0.04874276330791254], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 623.6923076923077, 83, 1800, 491.0, 1424.3999999999996, 1800.0, 1800.0, 0.06326064847030886, 0.012540929335422557, 0.04253176110346036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 623.6923076923077, 83, 1800, 491.0, 1424.3999999999996, 1800.0, 1800.0, 0.06417344601532264, 0.01272188431749072, 0.04314545837117921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 122.26666666666667, 78, 242, 80.0, 240.2, 242.0, 242.0, 0.07932352894515571, 0.03711060410155527, 0.04435094183470034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 101.60000000000001, 79, 237, 81.0, 236.4, 237.0, 237.0, 0.07938902208602594, 0.05899906817135326, 0.03984956772677474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 212.6, 77, 628, 231.0, 601.6, 628.0, 628.0, 0.07932394842885698, 3.128379530719521, 0.04580235017028207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36442041-f61a-47b1-8114-81d75aa810ac", 3, 0, 0.0, 447.6666666666667, 374, 556, 413.0, 556.0, 556.0, 556.0, 0.01964752342967169, 0.02322270754333916, 0.012599486053532952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 219.73333333333332, 77, 1003, 81.0, 865.6000000000001, 1003.0, 1003.0, 0.07939112301389874, 9.54338154249013, 0.04576360697689189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38435e9b-490e-4119-aa2a-ffb81cf44a13", 3, 0, 0.0, 361.0, 201, 643, 239.0, 643.0, 643.0, 643.0, 0.02220823925676426, 0.026249386960062182, 0.01424161176296406], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 212.49999999999997, 79, 382, 204.5, 378.0, 382.0, 382.0, 0.06709479536087415, 0.12637372100546343, 0.04336637652161411], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 82.58823529411765, 78, 97, 81.0, 90.6, 97.0, 97.0, 0.0871089066295002, 0.06473620893071255, 0.04372458789801085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 104.00000000000001, 78, 318, 81.0, 251.59999999999994, 318.0, 318.0, 0.0871102457021342, 0.031005002433962748, 0.04924971497015193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 618.3333333333334, 540, 699, 616.0, 699.0, 699.0, 699.0, 0.03279441183222379, 9.642645955629161, 0.01870306299806513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 957.3333333333334, 864, 1014, 994.0, 1014.0, 1014.0, 1014.0, 0.03265235042502476, 29.380642309147014, 0.018590156540809998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 132.33333333333334, 79, 238, 80.0, 238.0, 238.0, 238.0, 0.0329876955895451, 0.05837275821118723, 0.01826564785085163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eda2bbcd-c33a-4d8d-aa1a-83070de03ade", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 121.58823529411765, 79, 238, 85.0, 237.2, 238.0, 238.0, 0.09839158694054254, 0.07312109146655554, 0.04938796453851452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 110.29411764705883, 77, 239, 80.0, 235.8, 239.0, 239.0, 0.09831306349288965, 0.0436783796561356, 0.05509778535366679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 223.05882352941174, 79, 935, 81.0, 924.6, 935.0, 935.0, 0.09830794675178978, 10.43016367911708, 0.05680039800261384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 158.23529411764707, 77, 624, 80.0, 619.2, 624.0, 624.0, 0.09840012965664142, 3.427272898288995, 0.05694975334849853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.0329876955895451, 0.02451526986683967, 0.018523364222644955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 150.23529411764707, 78, 936, 81.0, 375.9999999999995, 936.0, 936.0, 0.0871102457021342, 4.632800890638211, 0.0507709416873767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 571.9411764705883, 78, 943, 850.0, 942.2, 943.0, 943.0, 0.08093156997724395, 42.84566967006103, 0.043487701376788826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 149.64705882352942, 79, 625, 80.0, 312.9999999999997, 625.0, 625.0, 0.0871102457021342, 1.5287627943173374, 0.05085601028669519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 408.1176470588235, 77, 703, 619.0, 695.0, 703.0, 703.0, 0.08093118468972411, 14.006897003165838, 0.04356652870676728], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 567.5454545454545, 249, 1243, 539.0, 1142.6000000000004, 1243.0, 1243.0, 0.06286756091009367, 0.012010918952283522, 0.042936802741597176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4064d6b1-46fa-478d-bab7-eccc65f4bb48", 2, 0, 0.0, 190.5, 178, 203, 190.5, 203.0, 203.0, 203.0, 0.02310722909662288, 0.032934571158712005, 0.014363038398437953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 345.58823529411757, 158, 1014, 174.0, 1008.4, 1014.0, 1014.0, 0.09825396917137226, 13.963289905921826, 0.21801792665341202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab428234-f9ff-4586-aa32-27ea1d3c9514", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 752.35, 170, 2150, 538.0, 1765.1000000000001, 2130.9999999999995, 2150.0, 0.09088636931676171, 0.05582766240258117, 0.041094129876621754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 90.29411764705883, 79, 235, 81.0, 118.1999999999999, 235.0, 235.0, 0.08093079940587271, 0.06014486166784095, 0.04062346767052595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 98.58823529411767, 79, 238, 80.0, 234.8, 238.0, 238.0, 0.08093118468972411, 0.09315826509723643, 0.04215785746590179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fcfb3b7-bee9-46be-a96a-7857fcd85153", 3, 0, 0.0, 314.0, 189, 545, 208.0, 545.0, 545.0, 545.0, 0.047467603360706316, 0.030517095259568677, 0.03043983679055711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e25e0c9-91e2-4bd2-a211-4401bbba6835", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["login", 20, 0, 0.0, 3417.3, 1770, 6735, 3011.5, 5646.000000000001, 6681.9, 6735.0, 0.08826320086497937, 15.962878256084645, 0.15512429941084313], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 95.4705882352941, 81, 238, 84.0, 125.1999999999999, 238.0, 238.0, 0.08515412897344193, 0.06893825480369468, 0.030269631783528185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/555b8806-2e9c-4142-8834-84e05b874c2a", 3, 0, 0.0, 419.66666666666663, 184, 849, 226.0, 849.0, 849.0, 849.0, 0.034875204891828736, 0.029074023348949676, 0.022364633345345903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0b6295d-7b8b-4aac-af26-588cb70e5f98", 3, 0, 0.0, 488.3333333333333, 236, 633, 596.0, 633.0, 633.0, 633.0, 0.029542679324063497, 0.029629230142395713, 0.018945012457163114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 663.7058823529413, 162, 1026, 932.0, 1025.2, 1026.0, 1026.0, 0.0808996035919424, 56.98342126951703, 0.1697692680846305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc6d0fca-8d8b-45c4-83ed-39c90f7c4c30", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1f5ee05-283b-4efb-9254-79904b4b61c1", 2, 0, 0.0, 272.5, 200, 345, 272.5, 345.0, 345.0, 345.0, 0.03455842966495602, 0.039013227238954264, 0.021480898907953624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 385.3333333333333, 159, 1085, 318.0, 946.4000000000001, 1085.0, 1085.0, 0.07928830814608077, 12.754014755223778, 0.17561637574464936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0f1f8b8-6f86-4819-bd1e-4d3d2ccbd804", 3, 0, 0.0, 393.0, 203, 762, 214.0, 762.0, 762.0, 762.0, 0.04845352499394331, 0.040393710126786726, 0.031072084712912864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 3, 50.0, 559.1666666666666, 79, 1095, 512.5, 1095.0, 1095.0, 1095.0, 0.059866497710106464, 35.81858159429472, 0.08715915071889686], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1422.904761904762, 226, 3992, 1455.0, 2338.4000000000005, 3838.399999999998, 3992.0, 0.08607051224250571, 0.027329308853786694, 0.03883259439066176], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 270.1764705882353, 161, 1017, 168.0, 462.5999999999995, 1017.0, 1017.0, 0.08707321320644547, 6.254645772083303, 0.19451919740265727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 97.69999999999999, 79, 242, 85.0, 126.80000000000004, 236.3499999999999, 242.0, 0.09283499507974526, 0.07207404403163817, 0.032999939657253195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8e6c051-d2d0-4044-9184-164f6574d46a", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eda2bbcd-c33a-4d8d-aa1a-83070de03ade", 3, 0, 0.0, 1177.0, 188, 2815, 528.0, 2815.0, 2815.0, 2815.0, 0.03430257154944716, 0.02859664249288222, 0.02199741730221709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3e23115-ea65-4c16-af0a-e083b4d3b2e2", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 330.125, 161, 1189, 314.5, 687.8000000000005, 1189.0, 1189.0, 0.08809262939981391, 6.714831641564855, 0.19671368037241158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0b6295d-7b8b-4aac-af26-588cb70e5f98", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.875, 79, 87, 81.5, 87.0, 87.0, 87.0, 0.05455462964225802, 0.04054304019312339, 0.027383866832149044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 100.0, 77, 234, 81.0, 234.0, 234.0, 234.0, 0.05455500167074692, 0.014597725056430332, 0.031113399390347858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 80.12500000000001, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.05455537370430988, 0.014704378068739771, 0.0320725927441353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36442041-f61a-47b1-8114-81d75aa810ac", 1, 0, 0.0, 1243.0, 1243, 1243, 1243.0, 1243.0, 1243.0, 1243.0, 0.8045052292839903, 0.14534518302493965, 0.5546686444086886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 99.625, 78, 235, 80.5, 235.0, 235.0, 235.0, 0.05455500167074692, 0.014704277794068509, 0.03212565039791054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.1844252008032128, 2.4825865963855422], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 908.2666666666667, 621, 1434, 853.5, 1257.6999999999998, 1277.3999999999999, 1434.0, 0.2730971952918044, 326.7191895157987, 0.5392602821094027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1422.904761904762, 226, 3992, 1455.0, 2338.4000000000005, 3838.399999999998, 3992.0, 0.08427473563818047, 0.026759109697614223, 0.0380223904930072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 123.9090909090909, 78, 238, 83.0, 238.0, 238.0, 238.0, 0.05393611022579617, 0.014537467209296625, 0.03176120553335458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 122.0909090909091, 79, 237, 80.0, 236.4, 237.0, 237.0, 0.05393637469109167, 0.014537538490958303, 0.03170868902738007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 127.35000000000001, 77, 860, 80.0, 218.8000000000003, 828.6499999999995, 860.0, 0.09597896141165856, 4.342677772532261, 0.05601272201133512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 130.85, 79, 616, 81.0, 239.4, 597.1999999999997, 616.0, 0.09597896141165856, 1.4356259357948737, 0.05610645146583869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 89.54999999999998, 79, 237, 81.0, 94.10000000000002, 229.8999999999999, 237.0, 0.09597804022439665, 0.07132743028395103, 0.048176477222011606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 110.45454545454547, 77, 246, 81.0, 243.60000000000002, 246.0, 246.0, 0.05397819281010472, 0.0144433836230163, 0.030784438087012846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 103.9, 77, 235, 80.5, 232.9, 234.9, 235.0, 0.09597850081581726, 0.03288950775026394, 0.05433470402629811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 128.36363636363635, 78, 278, 81.0, 269.8, 278.0, 278.0, 0.05397739819126646, 0.04011406252300174, 0.02709412370147555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 89.0909090909091, 82, 104, 86.0, 102.4, 104.0, 104.0, 0.055306675515734746, 0.043532402798517784, 0.019659794812233837], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 636.4545454545454, 81, 1085, 643.0, 1037.8000000000002, 1085.0, 1085.0, 0.062472313406558455, 0.011780113074887265, 0.04251711244448483], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2097.7499999999995, 1131, 5061, 1804.0, 3050.9, 4960.499999999998, 5061.0, 0.08986179256303806, 0.04651049810391618, 0.04133291435272551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 269.0909090909091, 161, 513, 172.0, 505.6, 513.0, 513.0, 0.05391416864351952, 0.08355643128639206, 0.12125422889260298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c034f0b7-01a9-4d7d-9469-b33c29a2375f", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 979.5901639344264, 416, 4172, 720.0, 1574.4, 1727.8999999999999, 4172.0, 0.28643204282393825, 96.57648502248021, 1.040535563355481], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 140.44999999999996, 79, 367, 81.0, 321.6, 326.79999999999995, 367.0, 0.27425562452576635, 0.20381692408604313, 0.13257474037134212], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 491.6666666666666, 384, 728, 465.0, 629.9, 700.5999999999997, 728.0, 0.27412906910336954, 80.6030482581382, 0.13786764705882354], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 118.21666666666664, 78, 333, 83.0, 237.9, 318.94999999999965, 333.0, 0.27441492451302785, 0.48558578439219385, 0.1334556957104374], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 766.4333333333333, 540, 1115, 769.5, 939.8, 1001.9499999999998, 1115.0, 0.2735466693413452, 246.13777391709712, 0.1373076055092299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 86.6875, 82, 100, 84.5, 98.6, 100.0, 100.0, 0.08804270070984427, 0.06577408793264734, 0.03129642876795246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 6, 3.2967032967032965, 176.65934065934064, 80, 3058, 88.0, 267.10000000000025, 425.0, 2658.769999999994, 0.763832930432447, 1.646059801141133, 0.36658390279806274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 85.62500000000001, 82, 94, 84.0, 94.0, 94.0, 94.0, 0.05786158063372896, 0.044808821721237374, 0.020567983740895843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 87.53333333333336, 81, 104, 86.0, 98.60000000000001, 104.0, 104.0, 0.0791995564824837, 0.06427229632514057, 0.028152967343382875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc6d0fca-8d8b-45c4-83ed-39c90f7c4c30", 3, 0, 0.0, 463.33333333333337, 213, 772, 405.0, 772.0, 772.0, 772.0, 0.019098548510313215, 0.022573837773745862, 0.012247441590272471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/146df1b5-f385-4f98-842c-088e49752700", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 182.87499999999997, 160, 317, 163.5, 317.0, 317.0, 317.0, 0.054524512176005124, 0.08450234455402356, 0.12262690580208964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 242.14999999999998, 159, 1097, 165.5, 322.40000000000003, 1058.2999999999995, 1097.0, 0.0959407469946561, 5.880179338740394, 0.21454562162408497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab428234-f9ff-4586-aa32-27ea1d3c9514", 3, 0, 0.0, 545.0, 168, 1085, 382.0, 1085.0, 1085.0, 1085.0, 0.044543429844097995, 0.02863713344469191, 0.02856463437268003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=555b8806-2e9c-4142-8834-84e05b874c2a", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38435e9b-490e-4119-aa2a-ffb81cf44a13", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 86.41176470588235, 81, 101, 84.0, 100.2, 101.0, 101.0, 0.10511281077839127, 0.08714919565513106, 0.03736431945638127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 94.23529411764707, 81, 238, 84.0, 127.59999999999991, 238.0, 238.0, 0.08219032378152845, 0.06380987051397961, 0.029216091656715192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fcfb3b7-bee9-46be-a96a-7857fcd85153", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 101.5, 79, 235, 81.0, 234.3, 235.0, 235.0, 0.08813241895948663, 0.06549684651188412, 0.04423834311052356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 99.75, 77, 238, 80.0, 236.6, 238.0, 238.0, 0.08814407148484198, 0.031859691853835095, 0.04980699547159833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 188.43750000000003, 78, 953, 82.0, 510.6000000000005, 953.0, 953.0, 0.08814407148484198, 4.979284636832653, 0.05134564320381664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e5307bc-65c6-49e2-b49e-dc1f0f482894", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.5412473516949153, 1.0113215042372883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 182.75, 78, 628, 158.0, 357.10000000000025, 628.0, 628.0, 0.08814504266770971, 1.6421210555093406, 0.0514322880800357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0f1f8b8-6f86-4819-bd1e-4d3d2ccbd804", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.2962962962962963], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 12.5, 0.14814814814814814], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07407407407407407], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6666666666666666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1350, 16, "401/Unauthorized", 9, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
