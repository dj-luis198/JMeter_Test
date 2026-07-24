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

    var data = {"OkPercent": 97.50183688464364, "KoPercent": 2.4981631153563555};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8023329129886507, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad715fdd-013e-4813-9781-6478b94e8859"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=913bc9dd-ba8c-473a-a4d8-404890f03baf"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55514940-29ca-43a9-9855-8f570511f560"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd4f901a-e106-4bfc-8d90-b8ffb205c34a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae097d26-0f87-44a2-b1e6-378092c56cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b079988-bd8a-4583-8b28-8295edb933d0"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0571b736-f32b-4c96-86bd-12a4f0112aa2"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4f9b52e-f6f3-49ef-afdb-fca29f86de4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7a7547c-bff3-47a6-ae07-70c354da0f9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd4f901a-e106-4bfc-8d90-b8ffb205c34a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27f0b79e-2d43-445a-bc4e-735de29c3f28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3625f27-1986-471f-9025-3ae03e7d790c"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb215339-5b7a-4d33-954f-21a578499844"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/913bc9dd-ba8c-473a-a4d8-404890f03baf"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f51da67-d782-4fa1-8144-eef136cfa31b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27f0b79e-2d43-445a-bc4e-735de29c3f28"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0571b736-f32b-4c96-86bd-12a4f0112aa2"], "isController": false}, {"data": [0.36885245901639346, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7982456140350878, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad715fdd-013e-4813-9781-6478b94e8859"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae097d26-0f87-44a2-b1e6-378092c56cc2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9217877094972067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/684f8b46-6b4f-427e-a9ec-091822f6d423"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f7a7547c-bff3-47a6-ae07-70c354da0f9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55514940-29ca-43a9-9855-8f570511f560"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b079988-bd8a-4583-8b28-8295edb933d0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f51da67-d782-4fa1-8144-eef136cfa31b"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bb215339-5b7a-4d33-954f-21a578499844"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3625f27-1986-471f-9025-3ae03e7d790c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 34, 2.4981631153563555, 302.4966936076412, 77, 3193, 93.0, 838.5999999999992, 1022.7999999999997, 1711.5399999999902, 5.356348709714236, 756.7890101073532, 3.9256358942268714], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1331.5087719298247, 958, 1757, 1287.0, 1682.6, 1693.1, 1757.0, 0.24974258987447148, 300.52478975891074, 1.2279823632987927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad715fdd-013e-4813-9781-6478b94e8859", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 465.9999999999999, 84, 939, 435.0, 906.0, 939.0, 939.0, 0.08120354480540924, 0.016526190173288366, 0.05441589106003107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 465.9999999999999, 84, 939, 435.0, 906.0, 939.0, 939.0, 0.08309512730173502, 0.016911156767267167, 0.055683473002393145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 127.30769230769229, 78, 238, 80.0, 237.6, 238.0, 238.0, 0.08896249204470022, 0.03408268550390409, 0.050161693606334136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 81.6923076923077, 79, 95, 80.0, 92.2, 95.0, 95.0, 0.08896249204470022, 0.06611372699806337, 0.04465500088962492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 157.69230769230768, 78, 627, 80.0, 472.59999999999985, 627.0, 627.0, 0.08896249204470022, 2.034281888776355, 0.051798999086423644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 193.8461538461538, 78, 776, 80.0, 561.5999999999998, 776.0, 776.0, 0.08896310084309647, 6.179761119104485, 0.051712475535147275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=913bc9dd-ba8c-473a-a4d8-404890f03baf", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 211.26666666666665, 80, 376, 204.0, 375.4, 376.0, 376.0, 0.08146108603919908, 0.1505969400500714, 0.05264740892650581], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/55514940-29ca-43a9-9855-8f570511f560", 3, 0, 0.0, 594.3333333333333, 214, 1256, 313.0, 1256.0, 1256.0, 1256.0, 0.0592194871592412, 0.03807242419905644, 0.03797603831500819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd4f901a-e106-4bfc-8d90-b8ffb205c34a", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 81.70588235294117, 78, 88, 81.0, 85.6, 88.0, 88.0, 0.08603195327958867, 0.0639358559040693, 0.043184007798543526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.70588235294116, 77, 239, 80.0, 238.2, 239.0, 239.0, 0.0859645219361233, 0.030597206911547565, 0.048601954555108316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 578.5555555555554, 466, 627, 621.0, 627.0, 627.0, 627.0, 0.05506102597045058, 16.189769833440394, 0.03140199137377259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 806.9999999999999, 622, 926, 855.0, 926.0, 926.0, 926.0, 0.05498332172574319, 49.47408953919394, 0.03130398102159011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 114.77777777777777, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.05524353190313968, 0.09775515606297763, 0.03058894784089863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 99.5, 79, 246, 81.0, 237.0, 246.0, 246.0, 0.08937837341291319, 0.06642279508518256, 0.04486375384202869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 127.1111111111111, 77, 312, 80.5, 245.4000000000001, 312.0, 312.0, 0.08931406795808193, 0.02389849084034614, 0.0509369293823436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 132.16666666666666, 78, 237, 81.5, 237.0, 237.0, 237.0, 0.08938414325298692, 0.024091819861156633, 0.05254809984208802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 123.38888888888887, 77, 242, 80.0, 238.4, 242.0, 242.0, 0.08931362479346223, 0.024072812932612868, 0.05259386303755638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 97.33333333333333, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.055244210099869254, 0.041055511607422365, 0.031020918757250802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 477.6190476190475, 78, 1119, 112.0, 939.2, 1101.0999999999997, 1119.0, 0.09520398587354191, 40.806162063818405, 0.05207353431196986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 134.52941176470588, 78, 537, 81.0, 298.5999999999998, 537.0, 537.0, 0.08596321785607736, 4.571798288889507, 0.05010241316450832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 344.5714285714286, 78, 710, 113.0, 704.8, 709.5, 710.0, 0.09520312266242333, 13.343383496312013, 0.05216603396258064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 144.82352941176467, 78, 628, 80.0, 380.7999999999998, 628.0, 628.0, 0.08603325944594581, 1.5098619577374264, 0.05022725274294274], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 419.26666666666665, 83, 876, 448.0, 828.0, 876.0, 876.0, 0.08331990957012482, 0.016956903471107433, 0.05625721237967216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae097d26-0f87-44a2-b1e6-378092c56cc2", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 263.33333333333337, 160, 488, 245.0, 472.70000000000005, 488.0, 488.0, 0.08927287245386328, 0.13835551619558695, 0.20077678248168668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b079988-bd8a-4583-8b28-8295edb933d0", 3, 0, 0.0, 265.3333333333333, 185, 383, 228.0, 383.0, 383.0, 383.0, 0.03540825720558034, 0.029518407130042727, 0.02270646702310979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 632.0869565217391, 113, 1888, 592.0, 1386.6000000000001, 1794.9999999999986, 1888.0, 0.09841256257755339, 0.060450685411407294, 0.04449708639981173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 82.8095238095238, 79, 100, 81.0, 90.80000000000001, 99.19999999999999, 100.0, 0.09520096470310899, 0.07074993568268158, 0.047786421735740256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 94.9047619047619, 78, 241, 80.0, 204.4000000000001, 240.39999999999998, 241.0, 0.09520355426602593, 0.09356547227763169, 0.05048834323148064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0571b736-f32b-4c96-86bd-12a4f0112aa2", 3, 0, 0.0, 806.0, 204, 1990, 224.0, 1990.0, 1990.0, 1990.0, 0.021742281490071024, 0.025698640654442675, 0.013942804210755184], "isController": false}, {"data": ["login", 23, 0, 0.0, 2922.6521739130435, 1793, 4589, 2810.0, 4283.0, 4532.599999999999, 4589.0, 0.09659360550331568, 45.34705173611257, 0.20841530446934414], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d4f9b52e-f6f3-49ef-afdb-fca29f86de4b", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7a7547c-bff3-47a6-ae07-70c354da0f9a", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 90.94117647058823, 81, 118, 85.0, 114.8, 118.0, 118.0, 0.08924774649440101, 0.072252326019393, 0.03172478488668161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd4f901a-e106-4bfc-8d90-b8ffb205c34a", 3, 0, 0.0, 439.0, 299, 713, 305.0, 713.0, 713.0, 713.0, 0.0331469736813029, 0.02763326809824763, 0.0212563600755751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27f0b79e-2d43-445a-bc4e-735de29c3f28", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3625f27-1986-471f-9025-3ae03e7d790c", 3, 0, 0.0, 372.6666666666667, 279, 464, 375.0, 464.0, 464.0, 464.0, 0.017066205499869157, 0.0235271420221178, 0.010944148709225991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 562.4761904761903, 161, 1200, 214.0, 1022.6, 1182.2999999999997, 1200.0, 0.0951655881233346, 54.292078661439355, 0.20243487246678268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb215339-5b7a-4d33-954f-21a578499844", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 300.0769230769231, 159, 856, 315.0, 645.9999999999998, 856.0, 856.0, 0.08891381515501783, 8.309647918390796, 0.19821929780314482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 575.0666666666667, 79, 1164, 776.0, 1044.0, 1164.0, 1164.0, 0.09159410378222586, 65.75683826313154, 0.14819639760389824], "isController": false}, {"data": ["register", 24, 9, 37.5, 983.2083333333331, 99, 2079, 942.5, 1724.5, 2001.5, 2079.0, 0.09879917832016696, 0.030730017866184747, 0.044575410531169084], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 93.0, 80, 247, 82.0, 124.5999999999999, 247.0, 247.0, 0.0842276326089757, 0.06539157023841374, 0.02994029127897183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 256.0588235294117, 160, 707, 168.0, 465.3999999999998, 707.0, 707.0, 0.0859275883158698, 6.172353209142695, 0.19195990245955083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 288.86666666666673, 161, 1103, 165.0, 739.4000000000002, 1103.0, 1103.0, 0.11189854531891086, 9.086496992726595, 0.24975376491980603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 81.55555555555556, 80, 88, 81.0, 88.0, 88.0, 88.0, 0.041692338337958094, 0.030984247534361437, 0.02092759951729537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 80.66666666666669, 77, 93, 79.0, 93.0, 93.0, 93.0, 0.04169446297531688, 0.011156526225817212, 0.023778873415610406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 98.55555555555556, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.041694076661508955, 0.011237856600172335, 0.02451155678733241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 98.66666666666667, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.04169426981751808, 0.01123790866175292, 0.024552387402308008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 90.33333333333333, 83, 95, 93.0, 95.0, 95.0, 95.0, 0.12199089134677944, 0.03597778240891347, 0.07541038498292128], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 919.5964912280699, 621, 1422, 855.0, 1330.8, 1351.0, 1422.0, 0.2563318463088214, 306.66200355379374, 0.5061552668324579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 983.2083333333331, 99, 2079, 942.5, 1724.5, 2001.5, 2079.0, 0.09793999542946688, 0.030462781781528517, 0.044187771375404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 100.00000000000001, 78, 246, 79.0, 246.0, 246.0, 246.0, 0.05796975428070404, 0.015624660333471013, 0.034136486163344276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 99.24999999999999, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.05796975428070404, 0.015624660333471013, 0.03407987507517953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 125.29411764705885, 78, 703, 79.0, 328.5999999999997, 703.0, 703.0, 0.0844728891715694, 4.49253785286065, 0.04923379673338369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/913bc9dd-ba8c-473a-a4d8-404890f03baf", 3, 0, 0.0, 300.6666666666667, 187, 494, 221.0, 494.0, 494.0, 494.0, 0.020683949255377827, 0.024811312827495866, 0.01326412110452289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 157.35294117647058, 77, 613, 83.0, 312.1999999999997, 613.0, 613.0, 0.0844082978321963, 1.481344292137119, 0.04927858058758106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 91.05882352941177, 79, 241, 81.0, 121.7999999999999, 241.0, 241.0, 0.08446701314704216, 0.06277284863759676, 0.042398481208573896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f51da67-d782-4fa1-8144-eef136cfa31b", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 118.24999999999999, 79, 235, 79.5, 235.0, 235.0, 235.0, 0.057970174345299344, 0.0155115505572383, 0.033061115056303526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 108.17647058823529, 78, 237, 80.0, 234.6, 237.0, 237.0, 0.08440787873070411, 0.030043153528001073, 0.04772187169505916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 120.12500000000001, 80, 238, 82.0, 238.0, 238.0, 238.0, 0.05796975428070404, 0.04308103809337479, 0.029098099316681524], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 572.1333333333334, 79, 1990, 478.0, 1549.6000000000004, 1990.0, 1990.0, 0.08179468443610745, 0.016199181644182218, 0.05565872667488249], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 105.875, 81, 235, 88.0, 235.0, 235.0, 235.0, 0.058492787108189725, 0.046040221102735264, 0.020792357917364314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1625.8260869565217, 1053, 3193, 1457.0, 2600.200000000001, 3130.199999999999, 3193.0, 0.09648015235474493, 0.04993601635548322, 0.044377101327231314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 240.875, 160, 483, 162.5, 483.0, 483.0, 483.0, 0.05793574925407723, 0.08978909576779351, 0.13029885794154283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27f0b79e-2d43-445a-bc4e-735de29c3f28", 3, 0, 0.0, 477.0, 376, 654, 401.0, 654.0, 654.0, 654.0, 0.049623687039947066, 0.031450950086841456, 0.03182248159788272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0571b736-f32b-4c96-86bd-12a4f0112aa2", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 816.8524590163936, 407, 1594, 693.0, 1462.4000000000003, 1549.4, 1594.0, 0.2838450299200581, 79.06761778987092, 1.0330824872269737], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 151.35087719298244, 79, 347, 83.0, 320.2, 329.1, 347.0, 0.25733053429945146, 0.19123880527527595, 0.124393178201395], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 512.8421052631579, 386, 789, 468.0, 633.6, 721.2999999999996, 789.0, 0.2570381092817814, 75.57773859731599, 0.12927209597667716], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 119.75438596491229, 78, 333, 83.0, 239.2, 251.19999999999953, 333.0, 0.25765972642865537, 0.45593693778195654, 0.1253071716420609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad715fdd-013e-4813-9781-6478b94e8859", 3, 0, 0.0, 303.0, 172, 478, 259.0, 478.0, 478.0, 478.0, 0.028260029955631753, 0.03340239868779261, 0.018122480147328958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae097d26-0f87-44a2-b1e6-378092c56cc2", 3, 0, 0.0, 440.0, 172, 687, 461.0, 687.0, 687.0, 687.0, 0.024950929837985296, 0.025024028265245017, 0.016000433522405936], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 762.5789473684208, 539, 1099, 718.0, 1012.2, 1036.0999999999997, 1099.0, 0.2567509740771604, 231.02497779470056, 0.12887695378482467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 105.20000000000002, 81, 242, 84.0, 239.0, 242.0, 242.0, 0.11090655014085131, 0.08285499107202271, 0.039423812745380746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, 7.262569832402234, 140.5698324022347, 79, 762, 87.0, 276.0, 342.0, 636.3999999999983, 0.7675683092914358, 1.6608061638093685, 0.36870464673633385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 85.33333333333333, 81, 107, 83.0, 107.0, 107.0, 107.0, 0.044431937676802084, 0.034408717361039114, 0.015794165346050743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 88.15384615384616, 81, 103, 86.0, 101.4, 103.0, 103.0, 0.08871479558063833, 0.07199413586670943, 0.03153533749155503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/684f8b46-6b4f-427e-a9ec-091822f6d423", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7a7547c-bff3-47a6-ae07-70c354da0f9a", 3, 0, 0.0, 820.3333333333334, 204, 1763, 494.0, 1763.0, 1763.0, 1763.0, 0.02265176683781335, 0.026773621545605558, 0.014526035374509211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55514940-29ca-43a9-9855-8f570511f560", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 181.66666666666666, 160, 318, 163.0, 318.0, 318.0, 318.0, 0.04167650695303058, 0.06459044583443313, 0.09373144093049747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b079988-bd8a-4583-8b28-8295edb933d0", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f51da67-d782-4fa1-8144-eef136cfa31b", 3, 0, 0.0, 315.6666666666667, 199, 515, 233.0, 515.0, 515.0, 515.0, 0.10251153254741159, 0.04638379890654365, 0.06573818981718776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 264.5882352941176, 161, 783, 173.0, 536.5999999999998, 783.0, 783.0, 0.08436892047484813, 6.060390932078056, 0.1884778807643824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 95.8888888888889, 80, 258, 83.5, 123.9000000000002, 258.0, 258.0, 0.0850858658195896, 0.07054482429768709, 0.030245366365557243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 83.5238095238095, 81, 90, 83.0, 88.6, 89.9, 90.0, 0.09609972405650663, 0.07460867248527615, 0.034160448785711346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb215339-5b7a-4d33-954f-21a578499844", 3, 0, 0.0, 876.3333333333334, 277, 1911, 441.0, 1911.0, 1911.0, 1911.0, 0.0847816871555744, 0.03836150558146107, 0.05436846474494843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3625f27-1986-471f-9025-3ae03e7d790c", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 103.46666666666665, 79, 260, 81.0, 248.0, 260.0, 260.0, 0.11196787268506424, 0.08321049913411512, 0.05620262359387013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 121.39999999999999, 78, 236, 81.0, 235.4, 236.0, 236.0, 0.11196620113608372, 0.04117090520941412, 0.0632288299905202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 153.33333333333334, 78, 862, 81.0, 485.2000000000002, 862.0, 862.0, 0.11196620113608372, 6.7446588039957005, 0.06518240693742583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 147.60000000000002, 78, 471, 82.0, 330.6000000000001, 471.0, 471.0, 0.11196536538030902, 2.2229352886840337, 0.06529126156975443], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6612784717119765], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.823529411764707, 0.2204261572373255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.2204261572373255], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.396032329169728], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 34, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
