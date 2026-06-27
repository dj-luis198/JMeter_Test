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

    var data = {"OkPercent": 97.37434358589647, "KoPercent": 2.625656414103526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7914012738853503, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507ca320-0403-49d1-8617-ce79f8d47ab3"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c92c570d-8b8d-42e1-8571-b8125bdb3b57"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95791372-3b6e-4cdc-89e6-cc7648e62615"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7335f5af-19d0-4ff6-a150-2f30d3f551bb"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/027f6774-b4d7-4ed0-8b79-91f5d5641dff"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bc36beb-7303-4a2d-aff7-43c8cdb4d59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7335f5af-19d0-4ff6-a150-2f30d3f551bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9234fd2-c716-4749-b2bd-978e666b6eaa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e67b09c8-68a6-4465-bcff-a7b976afef82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad26ff89-9c25-4615-917e-187e257bea4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0fa99f6-06c7-4ce1-8754-4e5ae76c3d2f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ca629ed-9fe3-4563-8c30-c95db7cfa16d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4dd2255a-7654-4b29-b250-f34d6cfa96a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8923ffc0-c62d-4286-84f3-b36ffbc73d64"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/559561c9-4f49-4f8a-a85f-f0fd26241e95"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c92c570d-8b8d-42e1-8571-b8125bdb3b57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/507ca320-0403-49d1-8617-ce79f8d47ab3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38be4d0e-6250-47a3-b12c-8b4b49eae98e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95791372-3b6e-4cdc-89e6-cc7648e62615"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=027f6774-b4d7-4ed0-8b79-91f5d5641dff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf2776c0-4d45-4697-9411-98ed8a71cb1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8448275862068966, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9216867469879518, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bc36beb-7303-4a2d-aff7-43c8cdb4d59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e67b09c8-68a6-4465-bcff-a7b976afef82"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38be4d0e-6250-47a3-b12c-8b4b49eae98e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0fa99f6-06c7-4ce1-8754-4e5ae76c3d2f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f9234fd2-c716-4749-b2bd-978e666b6eaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ca629ed-9fe3-4563-8c30-c95db7cfa16d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad26ff89-9c25-4615-917e-187e257bea4d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=559561c9-4f49-4f8a-a85f-f0fd26241e95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4dd2255a-7654-4b29-b250-f34d6cfa96a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8923ffc0-c62d-4286-84f3-b36ffbc73d64"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 35, 2.625656414103526, 313.1852963240811, 78, 2767, 95.0, 862.6000000000001, 1039.0, 1599.600000000005, 5.322440896150513, 786.8261765930888, 3.8822774297361935], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1302.1379310344828, 967, 1751, 1275.0, 1620.2, 1675.3, 1751.0, 0.26576368110191123, 319.8044605412529, 1.3067579436993388], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507ca320-0403-49d1-8617-ce79f8d47ab3", 1, 0, 0.0, 1152.0, 1152, 1152, 1152.0, 1152.0, 1152.0, 1152.0, 0.8680555555555555, 0.15682644314236113, 0.598483615451389], "isController": false}, {"data": ["deleteBook", 19, 4, 21.05263157894737, 598.736842105263, 82, 1673, 528.0, 1543.0, 1673.0, 1673.0, 0.10477093764474932, 0.02144853231080574, 0.07015603287601738], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 4, 21.05263157894737, 598.736842105263, 82, 1673, 528.0, 1543.0, 1673.0, 1673.0, 0.1022643479571351, 0.02093538743386457, 0.06847758661521156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 113.47368421052632, 79, 240, 80.0, 239.0, 240.0, 240.0, 0.09705563842177316, 0.048986758290594797, 0.0540650189769314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 100.78947368421053, 79, 238, 82.0, 234.0, 238.0, 238.0, 0.09705514264551886, 0.0721278940949608, 0.048717132148238966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 186.3157894736842, 79, 697, 81.0, 465.0, 697.0, 697.0, 0.09705613420309252, 4.527985928776122, 0.0558362104304695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c92c570d-8b8d-42e1-8571-b8125bdb3b57", 3, 0, 0.0, 406.0, 188, 674, 356.0, 674.0, 674.0, 674.0, 0.03952725404166173, 0.02541221573316468, 0.02534788100978958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 236.52631578947373, 78, 902, 80.0, 890.0, 902.0, 902.0, 0.09705613420309252, 13.81117868768613, 0.05574142904941179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95791372-3b6e-4cdc-89e6-cc7648e62615", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7335f5af-19d0-4ff6-a150-2f30d3f551bb", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["goToProfile", 19, 4, 21.05263157894737, 187.68421052631578, 79, 356, 189.0, 323.0, 356.0, 356.0, 0.10387963084459607, 0.15198589492301973, 0.06713520138980011], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 98.6875, 79, 363, 81.0, 167.0000000000002, 363.0, 363.0, 0.1562423709779796, 0.1161137151506274, 0.07842634636980617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 90.75, 79, 242, 80.0, 134.2000000000001, 242.0, 242.0, 0.15624389672278427, 0.056474386986836454, 0.08828771947384868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 576.25, 467, 713, 618.5, 713.0, 713.0, 713.0, 0.06375670441594875, 18.74658802011524, 0.036361245487220764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 847.125, 773, 925, 856.5, 925.0, 925.0, 925.0, 0.06368361977694813, 57.30263301916081, 0.0362573733691023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 158.5, 78, 239, 159.0, 239.0, 239.0, 239.0, 0.06408048508927212, 0.11339242088062607, 0.03548206547423564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 95.28571428571428, 79, 239, 81.5, 174.5, 239.0, 239.0, 0.06328656155070157, 0.04703229818367568, 0.0317668873408795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 124.49999999999999, 79, 239, 80.0, 236.5, 239.0, 239.0, 0.06329457294247427, 0.016936243150623, 0.036097686131254865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 147.78571428571428, 79, 246, 81.0, 243.0, 246.0, 246.0, 0.06325082113119576, 0.017048072883017604, 0.03718456476658188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 113.64285714285715, 79, 237, 81.0, 236.5, 237.0, 237.0, 0.06325110689437066, 0.01704814990512334, 0.037246501423149905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 104.25, 79, 235, 86.0, 235.0, 235.0, 235.0, 0.06407124722691633, 0.047615448378597, 0.0359775069877704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 499.54999999999995, 78, 1013, 466.5, 1005.5000000000001, 1012.9, 1013.0, 0.1007186274065457, 45.32697240120761, 0.05488378329380127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 133.125, 78, 775, 80.0, 397.0000000000004, 775.0, 775.0, 0.15624694830179098, 8.826436266503585, 0.09101689908400226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/027f6774-b4d7-4ed0-8b79-91f5d5641dff", 3, 0, 0.0, 1017.3333333333334, 189, 2624, 239.0, 2624.0, 2624.0, 2624.0, 0.0451304269338388, 0.037623380005716515, 0.02894106154285886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 356.2, 79, 711, 393.5, 685.7000000000002, 710.05, 711.0, 0.1007988307335635, 14.832685753345261, 0.05502592419927929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 144.125, 79, 630, 80.0, 359.10000000000025, 630.0, 630.0, 0.15624694830179098, 2.9108432635593053, 0.09116948399445324], "isController": false}, {"data": ["deleteBooks", 19, 4, 21.05263157894737, 565.1578947368422, 84, 1912, 423.0, 1450.0, 1912.0, 1912.0, 0.10219394258851879, 0.020920974163757725, 0.068924183524185], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 255.57142857142856, 159, 485, 253.0, 403.5, 485.0, 485.0, 0.06321883198692273, 0.09797684215160779, 0.14218063482996393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 558.1666666666665, 96, 1345, 532.5, 926.0, 1247.5, 1345.0, 0.10485202757608325, 0.06440617709507457, 0.04740868043723295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 82.05, 80, 87, 81.0, 85.80000000000001, 86.95, 87.0, 0.10079730669596508, 0.07490893593323186, 0.0505955230876231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bc36beb-7303-4a2d-aff7-43c8cdb4d59d", 3, 0, 0.0, 337.0, 189, 623, 199.0, 623.0, 623.0, 623.0, 0.041653360731988394, 0.02677909747580634, 0.026711302292323286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 128.44999999999996, 78, 245, 81.0, 242.9, 244.9, 245.0, 0.10079832271591001, 0.10266860409442786, 0.05325380135674542], "isController": false}, {"data": ["login", 24, 0, 0.0, 2622.4583333333335, 1662, 4596, 2396.0, 3634.5, 4385.25, 4596.0, 0.10424765768544138, 41.71233157487805, 0.2149089896230144], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 85.125, 80, 96, 83.0, 96.0, 96.0, 96.0, 0.16307061977027426, 0.1320171326069896, 0.05796650937146468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7335f5af-19d0-4ff6-a150-2f30d3f551bb", 2, 0, 0.0, 224.0, 204, 244, 224.0, 244.0, 244.0, 244.0, 0.035355678121906375, 0.029796826385942582, 0.021976454223235752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9234fd2-c716-4749-b2bd-978e666b6eaa", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e67b09c8-68a6-4465-bcff-a7b976afef82", 3, 0, 0.0, 411.0, 172, 836, 225.0, 836.0, 836.0, 836.0, 0.03673499375505106, 0.030624452801655527, 0.023557271385888864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad26ff89-9c25-4615-917e-187e257bea4d", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0fa99f6-06c7-4ce1-8754-4e5ae76c3d2f", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 602.6500000000001, 162, 1098, 591.0, 1089.4, 1097.85, 1098.0, 0.10067705318265335, 60.30039319108505, 0.2135454682741436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ca629ed-9fe3-4563-8c30-c95db7cfa16d", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4dd2255a-7654-4b29-b250-f34d6cfa96a3", 3, 0, 0.0, 288.3333333333333, 215, 380, 270.0, 380.0, 380.0, 380.0, 0.02279323496786154, 0.026940832086036866, 0.0146167554969685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8923ffc0-c62d-4286-84f3-b36ffbc73d64", 3, 0, 0.0, 352.3333333333333, 167, 472, 418.0, 472.0, 472.0, 472.0, 0.048579062424095217, 0.030788878430896283, 0.031152588859201684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 363.2105263157894, 162, 1097, 173.0, 983.0, 1097.0, 1097.0, 0.09701500158287635, 18.45245674535094, 0.21426971797994343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 516.1875, 78, 1092, 471.0, 1031.8, 1092.0, 1092.0, 0.1270526951052949, 76.01659526569895, 0.18533687823587333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/559561c9-4f49-4f8a-a85f-f0fd26241e95", 3, 0, 0.0, 296.3333333333333, 177, 513, 199.0, 513.0, 513.0, 513.0, 0.039839050237042345, 0.02561267064393185, 0.025547828439769996], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 928.1153846153848, 145, 1620, 931.0, 1578.0, 1620.0, 1620.0, 0.11153149906914095, 0.03480332385315591, 0.05031987555658508], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 263.6875, 161, 857, 163.5, 682.0000000000002, 857.0, 857.0, 0.15611888453057002, 11.900110518143942, 0.3486185003317526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 92.35, 81, 239, 83.0, 97.0, 231.8999999999999, 239.0, 0.11346938312369866, 0.08809390584310589, 0.04033481978225226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 306.6923076923077, 160, 949, 163.0, 884.1999999999999, 949.0, 949.0, 0.10768275005177055, 19.960597755746534, 0.2379423146614206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 82.0, 80, 89, 80.0, 89.0, 89.0, 89.0, 0.03237293622531564, 0.024058402800258984, 0.016249696503722887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 79.6, 78, 82, 79.0, 82.0, 82.0, 82.0, 0.03237293622531564, 0.008662289575914537, 0.018462690191000324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 84.0, 79, 102, 80.0, 102.0, 102.0, 102.0, 0.03236832565125071, 0.008724275273188668, 0.01902903519731731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 79.2, 78, 81, 79.0, 81.0, 81.0, 81.0, 0.03237335543354398, 0.0087256309566974, 0.019063606764088883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 88.0, 84, 94, 87.0, 94.0, 94.0, 94.0, 0.0446927374301676, 0.01318086592178771, 0.02762744413407821], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 885.8103448275862, 622, 1388, 823.5, 1251.0, 1338.2, 1388.0, 0.2573968304686841, 307.93609485738887, 0.5082581945387493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 928.1153846153848, 145, 1620, 931.0, 1578.0, 1620.0, 1620.0, 0.10957887993526416, 0.03419401046056846, 0.04943890872079302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 80.0, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.02935805673150883, 0.007912913728414489, 0.017287996297949044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 79.8, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.02935805673150883, 0.007912913728414489, 0.01725932632067218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 104.35, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.11207746794584418, 0.03020838003227831, 0.06588929267909979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c92c570d-8b8d-42e1-8571-b8125bdb3b57", 1, 0, 0.0, 1450.0, 1450, 1450, 1450.0, 1450.0, 1450.0, 1450.0, 0.689655172413793, 0.1245959051724138, 0.4754849137931035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 127.15000000000003, 78, 238, 81.0, 237.0, 237.95, 238.0, 0.11207809601730485, 0.0302085493171642, 0.06599911318206526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 79.4, 79, 80, 79.0, 80.0, 80.0, 80.0, 0.02935805673150883, 0.00785557377386076, 0.01674326672968863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 98.99999999999999, 79, 239, 81.0, 223.30000000000027, 238.85, 239.0, 0.11206993163734169, 0.08328634567970414, 0.05625385240390003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 82.0, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.02935719486131661, 0.021817212196740175, 0.014735935701871814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 95.64999999999999, 78, 237, 80.0, 220.20000000000033, 236.9, 237.0, 0.11207872409580488, 0.029989814845947795, 0.06391989733588872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 115.2, 79, 240, 87.0, 240.0, 240.0, 240.0, 0.02969456173796331, 0.023372867930467216, 0.010555488742791646], "isController": false}, {"data": ["deleteAccount", 18, 4, 22.22222222222222, 558.3333333333334, 78, 2624, 425.0, 1256.0000000000023, 2624.0, 2624.0, 0.0970774300368355, 0.019413379292305535, 0.06605605075531633], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1474.25, 1047, 2767, 1382.5, 2235.0, 2653.25, 2767.0, 0.10371202627371331, 0.05367907609869928, 0.04770348083488181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 163.4, 160, 167, 163.0, 167.0, 167.0, 167.0, 0.029343239611026015, 0.0454762902956038, 0.0659936336173759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/507ca320-0403-49d1-8617-ce79f8d47ab3", 3, 0, 0.0, 262.6666666666667, 177, 425, 186.0, 425.0, 425.0, 425.0, 0.026874255359174423, 0.026952988529172005, 0.017233816099470577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38be4d0e-6250-47a3-b12c-8b4b49eae98e", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95791372-3b6e-4cdc-89e6-cc7648e62615", 3, 0, 0.0, 307.3333333333333, 179, 420, 323.0, 420.0, 420.0, 420.0, 0.031781681039049096, 0.02601918223086213, 0.020380830614233954], "isController": false}, {"data": ["addBook", 54, 10, 18.51851851851852, 955.4259259259259, 406, 2505, 736.0, 1631.0, 2176.5, 2505.0, 0.27168307665990815, 97.43555663271466, 0.9835540548699192], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=027f6774-b4d7-4ed0-8b79-91f5d5641dff", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf2776c0-4d45-4697-9411-98ed8a71cb1b", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 135.41379310344826, 79, 391, 81.5, 322.2, 328.24999999999994, 391.0, 0.25811275076988804, 0.1918201204452, 0.1247713004209908], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 500.9827586206895, 387, 724, 466.5, 630.3, 704.35, 724.0, 0.257814444721027, 75.80600699321681, 0.12966253811653214], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 117.60344827586206, 78, 321, 83.5, 238.2, 259.1499999999998, 321.0, 0.2584347764093607, 0.4573084129431265, 0.1256841002459586], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 747.4310344827585, 542, 1088, 710.5, 950.3, 1011.55, 1088.0, 0.2578981302385558, 232.05719092520954, 0.12945277240490005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 95.92307692307692, 80, 238, 82.0, 181.59999999999997, 238.0, 238.0, 0.10219965094888445, 0.07635032517177404, 0.03632878217323627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 10, 6.024096385542169, 167.94578313252995, 79, 1987, 86.0, 316.6, 444.7500000000001, 1510.630000000009, 0.7229713250409393, 1.7121912672903383, 0.3420656755208878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 160.2, 81, 293, 102.0, 293.0, 293.0, 293.0, 0.03504885810820284, 0.027142328593559424, 0.012458773780650228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bc36beb-7303-4a2d-aff7-43c8cdb4d59d", 1, 0, 0.0, 1912.0, 1912, 1912, 1912.0, 1912.0, 1912.0, 1912.0, 0.5230125523012552, 0.0944895724372385, 0.36059263859832635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 85.63157894736844, 80, 100, 84.0, 94.0, 100.0, 100.0, 0.09497578117580018, 0.07707507241903315, 0.03376092221483522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e67b09c8-68a6-4465-bcff-a7b976afef82", 1, 0, 0.0, 968.0, 968, 968, 968.0, 968.0, 968.0, 968.0, 1.0330578512396695, 0.18663642820247933, 0.7122449638429752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38be4d0e-6250-47a3-b12c-8b4b49eae98e", 3, 0, 0.0, 384.3333333333333, 172, 504, 477.0, 504.0, 504.0, 504.0, 0.02840720785553988, 0.02309010352059996, 0.018216861808402852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 167.0, 160, 183, 161.0, 183.0, 183.0, 183.0, 0.03235136166881264, 0.05013829196133365, 0.07275897062819874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 235.75000000000003, 159, 477, 170.0, 457.60000000000036, 476.8, 477.0, 0.11201908805260416, 0.17360770775340117, 0.251933554477683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0fa99f6-06c7-4ce1-8754-4e5ae76c3d2f", 3, 0, 0.0, 270.0, 206, 386, 218.0, 386.0, 386.0, 386.0, 0.028047606136816224, 0.028129776857920178, 0.017986257841643215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9234fd2-c716-4749-b2bd-978e666b6eaa", 3, 0, 0.0, 1082.0, 206, 2666, 374.0, 2666.0, 2666.0, 2666.0, 0.07425191198673366, 0.03359705653045566, 0.04761597220503428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 96.28571428571428, 80, 238, 84.0, 166.0, 238.0, 238.0, 0.06342533026475546, 0.05258604042458728, 0.02254572286754979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 97.39999999999998, 80, 237, 84.0, 126.00000000000003, 231.49999999999991, 237.0, 0.09858627284736873, 0.07653914737661928, 0.03504433917621311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca629ed-9fe3-4563-8c30-c95db7cfa16d", 3, 0, 0.0, 335.0, 248, 425, 332.0, 425.0, 425.0, 425.0, 0.049164208456243856, 0.03160784886102917, 0.031527828990494916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad26ff89-9c25-4615-917e-187e257bea4d", 3, 0, 0.0, 543.6666666666667, 202, 1104, 325.0, 1104.0, 1104.0, 1104.0, 0.05584200435567634, 0.0359010281909052, 0.03581013951194088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=559561c9-4f49-4f8a-a85f-f0fd26241e95", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4dd2255a-7654-4b29-b250-f34d6cfa96a3", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 81.38461538461539, 79, 87, 81.0, 86.6, 87.0, 87.0, 0.10789187574175664, 0.08018136468698907, 0.05415666419068644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 116.07692307692308, 78, 241, 80.0, 239.4, 241.0, 241.0, 0.10775504790955208, 0.05373182151619641, 0.060061783014488904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8923ffc0-c62d-4286-84f3-b36ffbc73d64", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 200.00000000000003, 78, 869, 80.0, 801.0, 869.0, 869.0, 0.10789277118433065, 14.960315041704707, 0.062002681757822226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 187.15384615384616, 78, 621, 80.0, 619.4, 621.0, 621.0, 0.10789277118433065, 4.905230724541456, 0.062108045792181925], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.6751687921980495], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.30007501875468867], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.428571428571429, 0.30007501875468867], "isController": false}, {"data": ["401/Unauthorized", 18, 51.42857142857143, 1.350337584396099], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 35, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
