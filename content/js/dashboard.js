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

    var data = {"OkPercent": 97.88069073783359, "KoPercent": 2.119309262166405};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7966216216216216, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4642857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f8e521f-f974-40be-b304-d72b41747522"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f20ab9f-00cb-4b3c-92a3-699837c23d78"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/02ea8548-8faf-4499-bea9-599f401ea7cd"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a0a1dba5-af85-404b-937b-302d00fcfb9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ab1d438-9846-4d3e-aeaa-631d14f349ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cda0ff17-f793-4733-ba4c-9b87109dac6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/641157ee-db12-401f-b2e7-43eec398c3aa"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6cd34b4-20ee-4e13-b147-a3178f1bb699"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9559d5f8-76b0-4055-83d6-eff17140e798"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6815656-cf9e-43ea-881e-cfc8bae0309a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f8f2834-7c91-4eae-84ca-859d82b7a0e2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a6755c23-d84b-4bfe-904a-c3445ad68308"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86eb765e-134d-4309-8ca3-f93f9356ac21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6cd34b4-20ee-4e13-b147-a3178f1bb699"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f8e521f-f974-40be-b304-d72b41747522"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c857394c-4407-405a-8844-88f09ded80ff"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02ea8548-8faf-4499-bea9-599f401ea7cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0a1dba5-af85-404b-937b-302d00fcfb9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b6815656-cf9e-43ea-881e-cfc8bae0309a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c857394c-4407-405a-8844-88f09ded80ff"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6755c23-d84b-4bfe-904a-c3445ad68308"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2f8f2834-7c91-4eae-84ca-859d82b7a0e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9559d5f8-76b0-4055-83d6-eff17140e798"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f20ab9f-00cb-4b3c-92a3-699837c23d78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/401d71d1-6300-4cce-b446-561225b6bd6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 27, 2.119309262166405, 314.5047095761384, 77, 8479, 89.0, 711.0, 959.0, 2486.25, 5.07826669270906, 709.0721738750783, 3.7184176293881768], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1243.7500000000002, 950, 2650, 1238.5, 1452.1000000000001, 1910.05, 2650.0, 0.24593979745100966, 295.94884435057617, 1.209284062661947], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4f8e521f-f974-40be-b304-d72b41747522", 3, 0, 0.0, 580.0, 178, 1115, 447.0, 1115.0, 1115.0, 1115.0, 0.020532053958237803, 0.02426819268306037, 0.013166714289625153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f20ab9f-00cb-4b3c-92a3-699837c23d78", 3, 0, 0.0, 355.0, 190, 593, 282.0, 593.0, 593.0, 593.0, 0.03767660910518054, 0.0314094387755102, 0.024161106750392465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02ea8548-8faf-4499-bea9-599f401ea7cd", 3, 0, 0.0, 1051.6666666666667, 192, 2417, 546.0, 2417.0, 2417.0, 2417.0, 0.017918149891296555, 0.024689950680292425, 0.01149048023628067], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 723.923076923077, 85, 2948, 561.0, 2195.1999999999994, 2948.0, 2948.0, 0.06514886515688348, 0.013487850989511033, 0.043561451980274925], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 723.923076923077, 85, 2948, 561.0, 2195.1999999999994, 2948.0, 2948.0, 0.06601498032245778, 0.013667163894883838, 0.044140575409419826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 108.82352941176471, 79, 241, 81.0, 239.4, 241.0, 241.0, 0.09232055870229877, 0.03285950032855258, 0.05219548131594811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 81.5294117647059, 80, 84, 81.0, 84.0, 84.0, 84.0, 0.09231905465288036, 0.0686082037019941, 0.046339837980059084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 117.88235294117646, 78, 554, 81.0, 308.39999999999975, 554.0, 554.0, 0.09232055870229877, 1.620202470525304, 0.05389785375065847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 145.2941176470588, 78, 703, 81.0, 334.1999999999997, 703.0, 703.0, 0.09232206280072555, 4.909981958164528, 0.05380857359697618], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 477.7692307692307, 79, 2417, 188.0, 2111.3999999999996, 2417.0, 2417.0, 0.06560553912613422, 0.13922942351655784, 0.04239817105635011], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0a1dba5-af85-404b-937b-302d00fcfb9d", 3, 0, 0.0, 855.6666666666666, 405, 1653, 509.0, 1653.0, 1653.0, 1653.0, 0.02082725871620777, 0.0246171147130698, 0.013356022028297302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ab1d438-9846-4d3e-aeaa-631d14f349ae", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 102.66666666666666, 79, 242, 82.0, 241.4, 242.0, 242.0, 0.08242935804015958, 0.061258536590392036, 0.04137567386000198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 133.0666666666667, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.08242890506937765, 0.030309795301552412, 0.046548718917433715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 557.2, 552, 569, 555.0, 569.0, 569.0, 569.0, 0.03376439207212074, 9.927852352534018, 0.01925625485363136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 613.2, 552, 715, 554.0, 715.0, 715.0, 715.0, 0.033763936064610665, 30.380849021605545, 0.019223022193035177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 146.2, 81, 243, 85.0, 243.0, 243.0, 243.0, 0.0338356804016972, 0.059873293835815744, 0.018735186316174133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 82.38461538461537, 79, 93, 82.0, 90.2, 93.0, 93.0, 0.058873878565832316, 0.043752950770115616, 0.02955192732699005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 107.3076923076923, 80, 247, 81.0, 243.8, 247.0, 247.0, 0.05887467845367922, 0.02255565355421905, 0.03319661481920945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 117.76923076923076, 79, 557, 80.0, 371.79999999999984, 557.0, 557.0, 0.0588749450877916, 4.089707902432894, 0.03422283091115771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 142.3846153846154, 79, 555, 81.0, 428.5999999999999, 555.0, 555.0, 0.05887627829458067, 1.3463083582802693, 0.0342811022431862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cda0ff17-f793-4733-ba4c-9b87109dac6f", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.6, 81, 82, 82.0, 82.0, 82.0, 82.0, 0.033871667027964444, 0.025172205672149357, 0.019019734903398002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/641157ee-db12-401f-b2e7-43eec398c3aa", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 387.8823529411764, 79, 739, 542.0, 722.1999999999999, 739.0, 739.0, 0.08742337598222735, 41.65658077052135, 0.0474179409480808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 112.80000000000001, 78, 555, 81.0, 274.8000000000002, 555.0, 555.0, 0.08242890506937765, 4.965380933163896, 0.047986931584008796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6cd34b4-20ee-4e13-b147-a3178f1bb699", 3, 0, 0.0, 312.6666666666667, 218, 422, 298.0, 422.0, 422.0, 422.0, 0.020585167700499535, 0.024330971328292258, 0.01320077486002086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 300.2352941176471, 78, 637, 390.0, 589.8, 637.0, 637.0, 0.08742292640532354, 13.619746669572194, 0.04750307105169781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 163.66666666666666, 79, 687, 82.0, 419.40000000000015, 687.0, 687.0, 0.08242981101591994, 1.6365430070669824, 0.04806795685348925], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 813.4615384615385, 82, 5154, 474.0, 3467.1999999999985, 5154.0, 5154.0, 0.06679443242715553, 0.013828534838434544, 0.04495277344613029], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 226.84615384615387, 162, 638, 164.0, 511.1999999999999, 638.0, 638.0, 0.058852289806783406, 5.5001779715879255, 0.13120187835005342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9559d5f8-76b0-4055-83d6-eff17140e798", 1, 0, 0.0, 5154.0, 5154, 5154, 5154.0, 5154.0, 5154.0, 5154.0, 0.19402405898331393, 0.03505317471866511, 0.13377049379123013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 612.75, 89, 2041, 447.0, 1811.9000000000017, 2033.5, 2041.0, 0.0845987902372996, 0.051965467831310015, 0.038251210820185275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 81.6470588235294, 79, 84, 82.0, 83.2, 84.0, 84.0, 0.0874211281439466, 0.06496824073978844, 0.043881308462879444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 153.58823529411765, 80, 322, 86.0, 258.79999999999995, 322.0, 322.0, 0.08742292640532354, 0.09290694729426043, 0.04597136192063027], "isController": false}, {"data": ["login", 20, 0, 0.0, 3567.0999999999995, 1710, 11675, 2317.0, 10002.500000000007, 11610.099999999999, 11675.0, 0.0830078732967822, 24.940400509097664, 0.15965235005665288], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 84.53333333333333, 81, 90, 84.0, 89.4, 90.0, 90.0, 0.08187191956902622, 0.06628107551047142, 0.02910290890930229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6815656-cf9e-43ea-881e-cfc8bae0309a", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f8f2834-7c91-4eae-84ca-859d82b7a0e2", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6755c23-d84b-4bfe-904a-c3445ad68308", 3, 0, 0.0, 2152.3333333333335, 178, 5813, 466.0, 5813.0, 5813.0, 5813.0, 0.021378789390419452, 0.02526900529837664, 0.013709705435913516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 477.0588235294118, 161, 826, 634.0, 807.6, 826.0, 826.0, 0.08738517844567469, 55.410054146683734, 0.18469455828077372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 247.11764705882356, 161, 784, 163.0, 423.99999999999966, 784.0, 784.0, 0.09227846383498439, 6.628549497896594, 0.2061475861718008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 360.6363636363636, 79, 798, 82.0, 793.2, 798.0, 798.0, 0.06552026065150965, 35.639112915234655, 0.09083490681232019], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 988.6818181818179, 107, 3842, 821.0, 2269.599999999999, 3666.3499999999976, 3842.0, 0.08665955007937227, 0.02726575332752977, 0.03909835169596679], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 92.5, 82, 246, 84.0, 92.60000000000001, 238.34999999999988, 246.0, 0.09953517075258543, 0.077275840574517, 0.035381642728458104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 299.6666666666667, 163, 930, 320.0, 658.2000000000002, 930.0, 930.0, 0.08239223096190183, 6.690495901673111, 0.18389667018664585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 249.14285714285717, 161, 407, 243.5, 367.0, 407.0, 407.0, 0.10837423170410738, 0.16795889229923675, 0.2437361871235931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 82.14285714285714, 80, 88, 81.0, 88.0, 88.0, 88.0, 0.04915040022468755, 0.03652681110447971, 0.024671196987782616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 103.14285714285714, 79, 239, 81.0, 239.0, 239.0, 239.0, 0.04909662215239592, 0.02367158568061946, 0.027411367446133993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 171.0, 80, 713, 80.0, 713.0, 713.0, 713.0, 0.04893393918210416, 6.301425692502621, 0.028167052603984617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86eb765e-134d-4309-8ca3-f93f9356ac21", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 124.57142857142857, 79, 394, 79.0, 394.0, 394.0, 394.0, 0.04904330523852562, 2.07138176447303, 0.028277899072380912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 84.66666666666667, 82, 86, 86.0, 86.0, 86.0, 86.0, 0.030995577964210437, 0.009141273969913625, 0.019160352393891807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6cd34b4-20ee-4e13-b147-a3178f1bb699", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 799.2321428571428, 622, 1554, 666.5, 1051.8, 1148.0499999999997, 1554.0, 0.2424851261355665, 290.0965123277706, 0.4788134033653471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 988.6818181818179, 107, 3842, 821.0, 2269.599999999999, 3666.3499999999976, 3842.0, 0.08795391215003338, 0.02767299934834147, 0.039682331458315845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 132.66666666666666, 78, 240, 82.0, 240.0, 240.0, 240.0, 0.04706005385761719, 0.012684155141310884, 0.027712121558733562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 160.77777777777777, 78, 326, 85.0, 326.0, 326.0, 326.0, 0.04702120656416044, 0.012673684581746367, 0.027643326515258384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 104.6, 79, 241, 81.0, 240.5, 241.0, 241.0, 0.0960744000153719, 0.025895053129143208, 0.056481239071537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 136.85, 79, 250, 82.0, 240.8, 249.54999999999998, 250.0, 0.09600107521204237, 0.0258752898032458, 0.056531883157091366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 105.94999999999999, 80, 241, 82.0, 240.8, 241.0, 241.0, 0.09607301549177374, 0.07139801248949201, 0.04822415035426924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 98.11111111111111, 77, 239, 81.0, 239.0, 239.0, 239.0, 0.04702096089945874, 0.012581780553175482, 0.026816641762972562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 112.2, 78, 246, 80.5, 239.0, 245.65, 246.0, 0.09600107521204237, 0.02568778770322228, 0.05475061320686792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 101.33333333333333, 79, 258, 82.0, 258.0, 258.0, 258.0, 0.04705783931316469, 0.034971695036443685, 0.023620829498990872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 254.0, 82, 1501, 85.0, 1501.0, 1501.0, 1501.0, 0.04874614093050967, 0.03836854452147538, 0.017327729783892108], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 675.8461538461538, 80, 2479, 509.0, 2041.3999999999996, 2479.0, 2479.0, 0.06782313812442937, 0.01361353854180253, 0.04614948806573627], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2162.45, 819, 8479, 1278.0, 5018.800000000001, 8309.099999999999, 8479.0, 0.08498812290982335, 0.043987993302935915, 0.039091216689967574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f8e521f-f974-40be-b304-d72b41747522", 1, 0, 0.0, 937.0, 937, 937, 937.0, 937.0, 937.0, 937.0, 1.0672358591248667, 0.19281116595517608, 0.735809098185699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 263.55555555555554, 160, 585, 174.0, 585.0, 585.0, 585.0, 0.04699910701696668, 0.0728394363632091, 0.10570209322272878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c857394c-4407-405a-8844-88f09ded80ff", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1027.3749999999998, 409, 4405, 700.0, 1879.1000000000008, 3030.599999999999, 4405.0, 0.2580526243030275, 72.6477043468619, 0.940053345755956], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02ea8548-8faf-4499-bea9-599f401ea7cd", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 158.1964285714285, 80, 337, 83.0, 323.90000000000003, 328.15, 337.0, 0.24323396936120678, 0.18076274480847498, 0.11757892073613024], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 481.2321428571428, 388, 751, 410.0, 617.1, 650.8, 751.0, 0.2431927737004386, 71.50675022799322, 0.1223088656794198], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 114.94642857142853, 79, 334, 82.0, 241.0, 270.4999999999999, 334.0, 0.24335658257827608, 0.43062707776546505, 0.11835115051170067], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 635.607142857143, 539, 1470, 561.0, 756.3, 822.9999999999998, 1470.0, 0.24285949710736993, 218.5254023986712, 0.12190408350897279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 96.49999999999999, 81, 242, 83.0, 177.0, 242.0, 242.0, 0.11362898513083566, 0.08488884143075125, 0.04039155330822674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, 5.357142857142857, 221.9761904761905, 80, 3516, 84.0, 360.5, 619.4499999999983, 3314.5200000000004, 0.6961566352429296, 1.5017594918678132, 0.33315015409717186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 84.85714285714286, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.05141803597793432, 0.039818850127443274, 0.01827750497653134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0a1dba5-af85-404b-937b-302d00fcfb9d", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 112.58823529411765, 82, 244, 85.0, 243.2, 244.0, 244.0, 0.09399379640943697, 0.07627816876586145, 0.03341185731741705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6815656-cf9e-43ea-881e-cfc8bae0309a", 3, 0, 0.0, 1233.6666666666665, 188, 2479, 1034.0, 2479.0, 2479.0, 2479.0, 0.017387272516517907, 0.0239697588240408, 0.011150041294772227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c857394c-4407-405a-8844-88f09ded80ff", 3, 0, 0.0, 334.0, 186, 422, 394.0, 422.0, 422.0, 422.0, 0.019249154641292003, 0.02275184912191773, 0.01234402169379728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 254.28571428571428, 162, 794, 164.0, 794.0, 794.0, 794.0, 0.04890556335715733, 8.423260075419364, 0.10820219437516156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6755c23-d84b-4bfe-904a-c3445ad68308", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 260.09999999999997, 160, 481, 167.5, 480.9, 481.0, 481.0, 0.09596238274596358, 0.1487229506033635, 0.2158216479140177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f8f2834-7c91-4eae-84ca-859d82b7a0e2", 3, 0, 0.0, 674.0, 428, 988, 606.0, 988.0, 988.0, 988.0, 0.055127804627060406, 0.03544186658152484, 0.03535214033701465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 84.3076923076923, 83, 90, 83.0, 89.2, 90.0, 90.0, 0.05773928492116367, 0.04787173134576948, 0.0205245114368199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9559d5f8-76b0-4055-83d6-eff17140e798", 3, 0, 0.0, 1060.6666666666667, 335, 1462, 1385.0, 1462.0, 1462.0, 1462.0, 0.0643348845188823, 0.029109859857176557, 0.041256420085350944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 128.1176470588235, 79, 498, 83.0, 440.4, 498.0, 498.0, 0.08370178530984432, 0.06498331964973264, 0.02975336899685872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f20ab9f-00cb-4b3c-92a3-699837c23d78", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 81.28571428571429, 79, 84, 81.5, 83.5, 84.0, 84.0, 0.10844222740335085, 0.08059036626362305, 0.054432914927072605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 125.85714285714289, 78, 241, 81.0, 240.5, 241.0, 241.0, 0.10844222740335085, 0.029016767879412243, 0.06184595781597354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 120.28571428571429, 78, 326, 80.0, 283.0, 326.0, 326.0, 0.10844390738890308, 0.02922902191341529, 0.06375315649230436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/401d71d1-6300-4cce-b446-561225b6bd6f", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 148.14285714285714, 78, 243, 81.5, 241.5, 243.0, 243.0, 0.10844306738962045, 0.02922879550735864, 0.06385856409759877], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.47095761381475665], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.23547880690737832], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.23547880690737832], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.1773940345368916], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 27, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
