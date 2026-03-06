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

    var data = {"OkPercent": 97.66741911211437, "KoPercent": 2.3325808878856282};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7752114508783344, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=602e91ff-1c66-4520-8934-1799d7e9ea2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e6b10ca-80e6-4449-a6d4-e91f2642d356"], "isController": false}, {"data": [0.05172413793103448, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e6b10ca-80e6-4449-a6d4-e91f2642d356"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/602e91ff-1c66-4520-8934-1799d7e9ea2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90288ee2-8752-4b24-9efc-5b731a8c6a05"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2457627118644068, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9310344827586207, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82ea197d-ad9e-4be5-add4-0e6cd0ede93a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9034090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaa22bca-7bd5-4fa7-b961-9ab2f7dfa27c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82ea197d-ad9e-4be5-add4-0e6cd0ede93a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd8fb283-70db-4217-934b-0f063da9fca3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dafb0abe-2d7b-434c-a057-2a10e562ee09"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21ccb313-17f3-43d8-ba8e-9a30e2d58c35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaa22bca-7bd5-4fa7-b961-9ab2f7dfa27c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08b4fbb2-5882-415f-bab6-b9c108a04655"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08b4fbb2-5882-415f-bab6-b9c108a04655"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130f9592-d94e-4c48-830e-7fbfedffedfe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/008d8e3e-7587-449d-8b91-688b36f2a9e8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dafb0abe-2d7b-434c-a057-2a10e562ee09"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90288ee2-8752-4b24-9efc-5b731a8c6a05"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6c75abb-1ca8-490f-a876-bba1b123fb41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/130f9592-d94e-4c48-830e-7fbfedffedfe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aac832b6-b043-4a80-a9d1-dc1001797a01"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29c64bcd-471c-420d-95ff-d769eff3e0c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6c75abb-1ca8-490f-a876-bba1b123fb41"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aac832b6-b043-4a80-a9d1-dc1001797a01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 31, 2.3325808878856282, 369.90067720090303, 114, 1824, 134.0, 996.0, 1125.5, 1518.4000000000005, 5.202196744027651, 733.9200004452596, 3.8184480981547666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=602e91ff-1c66-4520-8934-1799d7e9ea2d", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e6b10ca-80e6-4449-a6d4-e91f2642d356", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1810.3965517241384, 1458, 2364, 1785.0, 2121.0, 2246.85, 2364.0, 0.2562222241856109, 308.3205691018638, 1.2598426745845224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 151.13333333333333, 126, 388, 130.0, 251.20000000000007, 388.0, 388.0, 0.08085468795480762, 0.06277292668366412, 0.02874131485893552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 354.06249999999994, 249, 734, 256.0, 664.7, 734.0, 734.0, 0.0815207699636723, 0.12634127141830853, 0.18334212229134503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 349.5652173913044, 243, 519, 259.0, 508.2, 517.0, 519.0, 0.11618860947492851, 0.18006965159835112, 0.2613109058796488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 127.33333333333333, 121, 133, 128.0, 133.0, 133.0, 133.0, 0.02678619261058233, 0.019906535719387844, 0.013445413087733709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 124.33333333333333, 121, 127, 125.0, 127.0, 127.0, 127.0, 0.026787149311570262, 0.007167655186885012, 0.015277046091754915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 124.0, 120, 127, 125.0, 127.0, 127.0, 127.0, 0.02678667095253402, 0.007219844905175185, 0.01574763272795457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 124.0, 120, 129, 123.0, 129.0, 129.0, 129.0, 0.026787627687691978, 0.0072201027751982285, 0.015774354976248302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 128.0, 127, 129, 128.0, 129.0, 129.0, 129.0, 0.04328629555882608, 0.01276607544801316, 0.026758032313219635], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1184.6724137931035, 950, 1824, 1008.0, 1597.4, 1728.55, 1824.0, 0.24674026333141896, 295.1871357390509, 0.48721563716418864], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 463.16666666666663, 128, 944, 440.0, 870.5000000000002, 944.0, 944.0, 0.08615119534783545, 0.01720499946155503, 0.0578688123698758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 463.16666666666663, 128, 944, 440.0, 870.5000000000002, 944.0, 944.0, 0.08790629189284223, 0.017555504582115466, 0.05904773220080728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e6b10ca-80e6-4449-a6d4-e91f2642d356", 3, 0, 0.0, 658.0, 207, 1077, 690.0, 1077.0, 1077.0, 1077.0, 0.01798431767498741, 0.021256854647747164, 0.011532912050691796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 915.8181818181818, 214, 1687, 1001.0, 1416.6, 1655.7999999999995, 1687.0, 0.09012404345617514, 0.02806775074966818, 0.04066143366870401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/602e91ff-1c66-4520-8934-1799d7e9ea2d", 3, 0, 0.0, 323.3333333333333, 211, 434, 325.0, 434.0, 434.0, 434.0, 0.03575685339690107, 0.02980901743146603, 0.022930013408820022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 202.36842105263156, 120, 381, 126.0, 376.0, 381.0, 381.0, 0.10264888139732141, 0.0355810061751406, 0.05808820847987812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 153.33333333333334, 121, 373, 127.0, 373.0, 373.0, 373.0, 0.06138149279790485, 0.01654423048068529, 0.03614554702845373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 139.57894736842104, 122, 376, 127.0, 130.0, 376.0, 376.0, 0.10265109971743935, 0.07628660828610483, 0.0515260402878553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 150.44444444444446, 120, 362, 124.0, 362.0, 362.0, 362.0, 0.06138191143272202, 0.016544343315850855, 0.036085850275877594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 176.57894736842107, 120, 616, 126.0, 377.0, 616.0, 616.0, 0.10264888139732141, 1.6147466767424647, 0.059982274496615286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 261.4210526315789, 119, 1057, 126.0, 382.0, 1057.0, 1057.0, 0.10264943596836236, 4.887481740893914, 0.05988235496715218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 221.93333333333334, 118, 1125, 124.0, 674.4000000000003, 1125.0, 1125.0, 0.08332407510276636, 5.019304495681035, 0.048508065076102655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 206.33333333333331, 119, 876, 125.0, 575.4000000000002, 876.0, 876.0, 0.08343948690278187, 1.6565888859994105, 0.048656737251837064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 124.46666666666667, 119, 130, 125.0, 128.8, 130.0, 130.0, 0.08378952072394145, 0.06226936061613227, 0.04205841176963467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 153.11111111111111, 121, 379, 126.0, 379.0, 379.0, 379.0, 0.06138358602909582, 0.016424904855441656, 0.03500782640721871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 141.33333333333334, 119, 367, 126.0, 225.4000000000001, 367.0, 367.0, 0.0837890526809704, 0.030809932912898488, 0.047316812692365706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 126.33333333333333, 124, 130, 126.0, 130.0, 130.0, 130.0, 0.06138107416879795, 0.0456162084398977, 0.03081042199488491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 161.11111111111114, 127, 395, 130.0, 395.0, 395.0, 395.0, 0.062063829200342036, 0.04885102181198797, 0.022061751786059083], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 533.7499999999999, 127, 1240, 437.0, 1119.4000000000005, 1240.0, 1240.0, 0.09177048202445683, 0.017908985668509726, 0.062449932510458016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90288ee2-8752-4b24-9efc-5b731a8c6a05", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1221.6666666666667, 796, 1731, 1230.0, 1659.6000000000001, 1726.8, 1731.0, 0.0898907185692822, 0.046525469571991766, 0.0413462191856757], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 216.66666666666666, 126, 328, 213.0, 313.00000000000006, 328.0, 328.0, 0.0868665078939939, 0.17856128929804624, 0.056143701635262014], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 309.3333333333333, 251, 503, 256.0, 503.0, 503.0, 503.0, 0.06132795464457043, 0.09504635158294264, 0.13792800736957586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.25, 120, 360, 128.0, 199.00000000000017, 360.0, 360.0, 0.08167640827994588, 0.06069897138773322, 0.04099772837489471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 155.0, 118, 374, 125.0, 374.0, 374.0, 374.0, 0.08157480154380312, 0.021827632444337945, 0.04652312900545021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 785.8571428571428, 605, 983, 832.0, 983.0, 983.0, 983.0, 0.0406617407872113, 11.955901888302199, 0.023189899042706446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1026.857142857143, 874, 1119, 1073.0, 1119.0, 1119.0, 1119.0, 0.04065890662391673, 36.584955650934575, 0.023148576720452594], "isController": false}, {"data": ["addBook", 59, 15, 25.423728813559322, 1107.6610169491528, 619, 2755, 992.0, 1785.0, 1809.0, 2755.0, 0.2706086860801644, 72.38961964143203, 0.985462451324836], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 260.85714285714283, 115, 376, 359.0, 376.0, 376.0, 376.0, 0.040781371069695364, 0.07216391052567188, 0.0225810912075364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 143.92857142857144, 120, 387, 126.0, 258.0, 387.0, 387.0, 0.0742162236664935, 0.05515483028339995, 0.03725306539509537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 177.5, 118, 375, 126.0, 374.5, 375.0, 375.0, 0.07421661710056882, 0.03578301181634568, 0.04143623069705307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 299.2857142857143, 119, 1125, 126.0, 1107.0, 1125.0, 1125.0, 0.07412074268984176, 9.544834528750906, 0.042664925270408355], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 233.82758620689654, 121, 632, 128.0, 506.4, 515.8499999999999, 632.0, 0.2476505224145072, 0.18404496831781247, 0.1197138755812315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 263.50000000000006, 121, 824, 126.0, 722.0, 824.0, 824.0, 0.07411838824270596, 3.130447205207346, 0.04273595125657139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82ea197d-ad9e-4be5-add4-0e6cd0ede93a", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 692.2586206896551, 589, 999, 624.0, 879.3, 959.8999999999999, 999.0, 0.24759449144945234, 72.80100139698789, 0.12452262021139447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 124.14285714285715, 118, 128, 126.0, 128.0, 128.0, 128.0, 0.04083942521426113, 0.030350393152395235, 0.022932294431836083], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 193.74137931034485, 120, 500, 129.0, 377.0, 379.2, 500.0, 0.24811560476039735, 0.43904831623617185, 0.1206655968463651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 616.5555555555557, 114, 1132, 606.0, 1126.6, 1132.0, 1132.0, 0.0897518361729817, 40.391525439970984, 0.048907738852074015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 155.87499999999997, 119, 374, 125.0, 374.0, 374.0, 374.0, 0.08157521744893902, 0.021987070328034344, 0.04795730557056766], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 947.3965517241379, 823, 1257, 875.0, 1122.1, 1220.15, 1257.0, 0.24733686428029236, 222.55414525123882, 0.12415151195319364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 534.2777777777779, 119, 1008, 603.0, 962.1, 1008.0, 1008.0, 0.08986251035915051, 13.223391258249876, 0.04905580399488782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 138.2608695652174, 121, 360, 129.0, 135.8, 315.39999999999935, 360.0, 0.11668374646143856, 0.08717096293261767, 0.041477425499964485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 179.50000000000003, 119, 505, 127.0, 415.4000000000001, 505.0, 505.0, 0.08168057789008856, 0.022015468259437936, 0.048099012175511144], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 352.75, 127, 499, 386.0, 499.0, 499.0, 499.0, 0.08803914807451046, 0.017582036895739638, 0.05965282770738722], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 15, 8.522727272727273, 185.31249999999994, 116, 1483, 131.0, 290.90000000000003, 366.1000000000001, 1176.5399999999959, 0.7464838912169384, 1.6207726638447315, 0.35676929804005564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaa22bca-7bd5-4fa7-b961-9ab2f7dfa27c", 3, 0, 0.0, 343.6666666666667, 278, 420, 333.0, 420.0, 420.0, 420.0, 0.04104247896572953, 0.0342154259867296, 0.026319558451330462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 129.33333333333334, 129, 130, 129.0, 130.0, 130.0, 130.0, 0.026582547671368823, 0.020585898733784646, 0.009449264992556886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82ea197d-ad9e-4be5-add4-0e6cd0ede93a", 3, 0, 0.0, 270.0, 209, 388, 213.0, 388.0, 388.0, 388.0, 0.020484107746406747, 0.028238996193369975, 0.013135967532689221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd8fb283-70db-4217-934b-0f063da9fca3", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 500.00000000000006, 249, 1252, 375.5, 1234.0, 1252.0, 1252.0, 0.07406741192591143, 12.75701639931858, 0.16387208227302308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 130.36842105263156, 121, 139, 130.0, 135.0, 139.0, 139.0, 0.10170543963514511, 0.08253634798516171, 0.03615310549530549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dafb0abe-2d7b-434c-a057-2a10e562ee09", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 528.6190476190476, 123, 1075, 427.0, 1041.6000000000001, 1072.8999999999999, 1075.0, 0.08877540667591059, 0.05453098710854273, 0.04013966141694004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 140.38888888888886, 123, 376, 127.0, 158.20000000000033, 376.0, 376.0, 0.08986206173523642, 0.0667822548637841, 0.04510654270694484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 167.94444444444443, 122, 383, 126.0, 379.4, 383.0, 383.0, 0.0898647535459134, 0.09153216596522235, 0.047477374676112453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21ccb313-17f3-43d8-ba8e-9a30e2d58c35", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaa22bca-7bd5-4fa7-b961-9ab2f7dfa27c", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08b4fbb2-5882-415f-bab6-b9c108a04655", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08b4fbb2-5882-415f-bab6-b9c108a04655", 3, 0, 0.0, 292.0, 216, 438, 222.0, 438.0, 438.0, 438.0, 0.07834125450462213, 0.03682446989084452, 0.050238369587925005], "isController": false}, {"data": ["login", 21, 0, 0.0, 2433.6190476190473, 1425, 3293, 2620.0, 3116.8, 3276.2999999999997, 3293.0, 0.09249267766301834, 37.008843407969785, 0.19067582279944506], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 255.0, 251, 260, 254.0, 260.0, 260.0, 260.0, 0.026755852842809364, 0.04146634615384615, 0.060174540133779264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130f9592-d94e-4c48-830e-7fbfedffedfe", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 131.0625, 123, 152, 131.0, 138.70000000000002, 152.0, 152.0, 0.08368507215222315, 0.06774895001386033, 0.02974742799161057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 367.3333333333333, 247, 1255, 253.0, 800.2000000000003, 1255.0, 1255.0, 0.08326625773682313, 6.761469493324821, 0.18584746835882204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/008d8e3e-7587-449d-8b91-688b36f2a9e8", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dafb0abe-2d7b-434c-a057-2a10e562ee09", 3, 0, 0.0, 501.33333333333337, 215, 838, 451.0, 838.0, 838.0, 838.0, 0.025060563027316015, 0.025133982645560105, 0.01607073866009523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90288ee2-8752-4b24-9efc-5b731a8c6a05", 3, 0, 0.0, 619.6666666666667, 291, 1240, 328.0, 1240.0, 1240.0, 1240.0, 0.025083192588752697, 0.029647484469323256, 0.016085250455677998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6c75abb-1ca8-490f-a876-bba1b123fb41", 3, 0, 0.0, 635.6666666666666, 213, 870, 824.0, 870.0, 870.0, 870.0, 0.02201059443278698, 0.022075078596164286, 0.014114866872588006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130f9592-d94e-4c48-830e-7fbfedffedfe", 3, 0, 0.0, 363.0, 264, 436, 389.0, 436.0, 436.0, 436.0, 0.01755135233169716, 0.02074510426965898, 0.011255261749167774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 187.8571428571429, 125, 443, 130.0, 413.5, 443.0, 443.0, 0.07782966422059151, 0.06452869621414277, 0.027666013453413386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 775.7777777777777, 251, 1259, 880.5, 1253.6, 1259.0, 1259.0, 0.08969458992131792, 53.7224607632885, 0.1902506340909204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 131.7222222222222, 122, 143, 130.0, 143.0, 143.0, 143.0, 0.09171273533233129, 0.07120275838789393, 0.03260101138766464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aac832b6-b043-4a80-a9d1-dc1001797a01", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 444.2631578947368, 249, 1185, 491.0, 749.0, 1185.0, 1185.0, 0.1025801609968632, 6.609640054988365, 0.2293238128370973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 779.0, 126, 1242, 1006.0, 1242.0, 1242.0, 1242.0, 0.06384843542311197, 48.614801844929566, 0.10700167928640668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 126.21739130434783, 115, 139, 127.0, 132.6, 137.79999999999998, 139.0, 0.11642032800161976, 0.08651940391526625, 0.058437547453938046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29c64bcd-471c-420d-95ff-d769eff3e0c2", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 167.08695652173913, 119, 374, 127.0, 368.0, 374.0, 374.0, 0.1164291680376623, 0.031153898478827612, 0.06640100989647929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6c75abb-1ca8-490f-a876-bba1b123fb41", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aac832b6-b043-4a80-a9d1-dc1001797a01", 3, 0, 0.0, 505.3333333333333, 203, 870, 443.0, 870.0, 870.0, 870.0, 0.049610557126556536, 0.03189480804848605, 0.03181406169899621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 189.8695652173913, 124, 394, 127.0, 375.0, 390.19999999999993, 394.0, 0.11627084028430748, 0.031338624920379754, 0.06835453696401671], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 915.8181818181818, 214, 1687, 1001.0, 1416.6, 1655.7999999999995, 1687.0, 0.09348931884532191, 0.029115814143234137, 0.04217975127591673], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 176.91304347826085, 114, 377, 126.0, 371.2, 376.0, 377.0, 0.11642975742113149, 0.031381458054914345, 0.06856166379388895], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.6019563581640331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.1504890895410083], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.1504890895410083], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.4296463506395787], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 31, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
