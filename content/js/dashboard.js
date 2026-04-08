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

    var data = {"OkPercent": 97.75193798449612, "KoPercent": 2.248062015503876};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7435643564356436, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f757229-4b33-4470-9e73-270b1be44d85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b971787d-b5e8-473e-b8d3-2f7b12972309"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7113d40-c3f2-456b-8218-ad436efb0e6a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb196618-9946-4eaf-a53e-08d55d2faf3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e09a2ab7-0d4f-48a8-af5d-1af27f8554f2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1188c16f-db94-4d93-a8a8-5dbc1910e895"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c10b450-8763-468d-aa66-8b45bbcbbb3d"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f757229-4b33-4470-9e73-270b1be44d85"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=727dc781-a910-45ed-b517-5abbb42e6caf"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18e8be21-0084-45ba-9532-68758717a58c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1282b2a-dfee-46b0-9c28-a47cbed67de7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d50dbbf-4247-4e2b-a785-3fafcaf55d0f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97fc4d6f-96ec-467c-951e-bea3a08c1c6e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b971787d-b5e8-473e-b8d3-2f7b12972309"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5174c20-d8a5-405d-bf49-c5870e72aa84"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c10b450-8763-468d-aa66-8b45bbcbbb3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/194a6c85-e8f4-4db9-b039-bb718ef6f498"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb196618-9946-4eaf-a53e-08d55d2faf3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9454022988505747, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4546cfc-3258-4c6f-a0a4-031eeef85591"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1188c16f-db94-4d93-a8a8-5dbc1910e895"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4546cfc-3258-4c6f-a0a4-031eeef85591"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5174c20-d8a5-405d-bf49-c5870e72aa84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7113d40-c3f2-456b-8218-ad436efb0e6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=194a6c85-e8f4-4db9-b039-bb718ef6f498"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18e8be21-0084-45ba-9532-68758717a58c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97fc4d6f-96ec-467c-951e-bea3a08c1c6e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1282b2a-dfee-46b0-9c28-a47cbed67de7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/727dc781-a910-45ed-b517-5abbb42e6caf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 29, 2.248062015503876, 453.7697674418605, 125, 3109, 171.0, 1249.2000000000007, 1490.7000000000003, 1965.3399999999979, 4.989846243109951, 678.8473597210135, 3.6409755463688236], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2292.134615384615, 1636, 3701, 2286.5, 2703.8, 2941.7999999999984, 3701.0, 0.24739874492713632, 297.7030015236432, 1.2164576960040345], "isController": true}, {"data": ["deleteBook", 18, 4, 22.22222222222222, 585.8333333333333, 136, 1139, 554.5, 983.3000000000003, 1139.0, 1139.0, 0.102739139616783, 0.021169881307755094, 0.0687380137670447], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, 22.22222222222222, 585.8333333333333, 136, 1139, 554.5, 983.3000000000003, 1139.0, 1139.0, 0.10312763190310585, 0.02124993196440951, 0.06899793601503372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 232.5, 131, 424, 141.0, 418.0, 424.0, 424.0, 0.07987266015894659, 0.029941104610364047, 0.04507322967953948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f757229-4b33-4470-9e73-270b1be44d85", 3, 0, 0.0, 461.0, 242, 893, 248.0, 893.0, 893.0, 893.0, 0.026561600779140288, 0.02663941796892293, 0.017033318207977335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 158.28571428571433, 127, 380, 140.5, 273.0, 380.0, 380.0, 0.07987402724845385, 0.05935950657819667, 0.040093017583696565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 287.7857142857143, 128, 999, 143.0, 771.5, 999.0, 999.0, 0.07987448295535587, 1.6975444836685207, 0.04654516117529596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 259.2857142857143, 125, 1602, 135.5, 1004.5, 1602.0, 1602.0, 0.0798749386674578, 5.153677465354245, 0.04646742386206739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b971787d-b5e8-473e-b8d3-2f7b12972309", 3, 0, 0.0, 436.3333333333333, 316, 506, 487.0, 506.0, 506.0, 506.0, 0.018763134193935754, 0.02586649521852797, 0.012032348425147603], "isController": false}, {"data": ["goToProfile", 18, 4, 22.22222222222222, 259.3333333333333, 133, 477, 243.5, 410.4000000000001, 477.0, 477.0, 0.10272682654004635, 0.19515421864834323, 0.0663889951033546], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7113d40-c3f2-456b-8218-ad436efb0e6a", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.2474850171232877, 0.9444563356164384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb196618-9946-4eaf-a53e-08d55d2faf3a", 1, 0, 0.0, 885.0, 885, 885, 885.0, 885.0, 885.0, 885.0, 1.1299435028248588, 0.2041401836158192, 0.7790430790960452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 139.2941176470588, 132, 148, 140.0, 145.6, 148.0, 148.0, 0.08554449068319855, 0.06357359122061924, 0.0429393244249649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 184.17647058823528, 128, 426, 136.0, 401.2, 426.0, 426.0, 0.08542026771716847, 0.0304034914278249, 0.0482942483267677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 943.0, 788, 1186, 923.0, 1186.0, 1186.0, 1186.0, 0.0769714307706123, 22.632156338597326, 0.04389776911136484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1391.8333333333333, 1180, 1878, 1350.5, 1878.0, 1878.0, 1878.0, 0.07677052012027383, 69.07824895240228, 0.0437082160450387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 374.6666666666667, 134, 497, 400.5, 497.0, 497.0, 497.0, 0.07775848215442835, 0.13759606412482828, 0.04305572205230553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 172.50000000000003, 125, 396, 139.0, 348.3000000000002, 396.0, 396.0, 0.06342260064373939, 0.04713339754871649, 0.031835172588752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 230.25000000000003, 133, 432, 142.0, 429.0, 432.0, 432.0, 0.0633369048310224, 0.024874992082886897, 0.03567855267255348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 331.83333333333337, 131, 1112, 266.5, 912.8000000000006, 1112.0, 1112.0, 0.06309712224541626, 4.7468312181556716, 0.03664233922064538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e09a2ab7-0d4f-48a8-af5d-1af27f8554f2", 2, 0, 0.0, 288.0, 245, 331, 288.0, 331.0, 331.0, 331.0, 0.06157066773389157, 0.03785032747898901, 0.038271220715451165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 238.41666666666669, 129, 1116, 135.5, 899.1000000000008, 1116.0, 1116.0, 0.06309546343617893, 1.5616024506015103, 0.036702992565251225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 185.33333333333334, 133, 420, 140.0, 420.0, 420.0, 420.0, 0.07802239242662644, 0.05798343812174094, 0.043811401997373246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1188c16f-db94-4d93-a8a8-5dbc1910e895", 1, 0, 0.0, 917.0, 917, 917, 917.0, 917.0, 917.0, 917.0, 1.0905125408942202, 0.19701642584514723, 0.7518572791712105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1028.0, 133, 1846, 1274.5, 1778.1000000000001, 1846.0, 1846.0, 0.12442647173186094, 69.98705004763201, 0.06646609378645306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 265.70588235294116, 127, 1263, 141.0, 585.3999999999994, 1263.0, 1263.0, 0.0855431993156544, 4.549460362363509, 0.04985761145775676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 768.8125, 127, 1488, 918.5, 1289.2000000000003, 1488.0, 1488.0, 0.12442937466462396, 22.879056349008845, 0.06658915753536516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 216.58823529411768, 131, 695, 137.0, 466.9999999999998, 695.0, 695.0, 0.08543486345498588, 1.4993602593450663, 0.049877901958468605], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 554.5882352941177, 143, 1354, 498.0, 1004.3999999999996, 1354.0, 1354.0, 0.09805561483754491, 0.020351271622705065, 0.06595997528421708], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c10b450-8763-468d-aa66-8b45bbcbbb3d", 3, 0, 0.0, 305.6666666666667, 234, 446, 237.0, 446.0, 446.0, 446.0, 0.09557488292076843, 0.043245145592404985, 0.06128988260218548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 531.1666666666667, 267, 1242, 537.5, 1122.6000000000004, 1242.0, 1242.0, 0.0630503772514239, 6.375420376896765, 0.1404574403385805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 623.5238095238095, 171, 1770, 598.0, 1421.4000000000003, 1742.9999999999995, 1770.0, 0.0963643121653061, 0.05919253159372806, 0.04357097317630539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 156.18750000000003, 127, 397, 141.5, 224.80000000000018, 397.0, 397.0, 0.12441486135518888, 0.09246065380009642, 0.06245042845367879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 242.31249999999994, 131, 428, 143.0, 423.8, 428.0, 428.0, 0.1244284070053193, 0.15009784155597725, 0.06443179962360407], "isController": false}, {"data": ["login", 21, 0, 0.0, 2657.809523809524, 1305, 4797, 2438.0, 4227.200000000001, 4750.699999999999, 4797.0, 0.09573085952636018, 32.852298822738355, 0.18979230534725228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 145.52941176470586, 137, 181, 143.0, 160.99999999999997, 181.0, 181.0, 0.08778271196943095, 0.07106627756118972, 0.031204010895383664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f757229-4b33-4470-9e73-270b1be44d85", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1195.2500000000002, 280, 1989, 1412.0, 1916.9, 1989.0, 1989.0, 0.124278601555036, 92.99748639246405, 0.259631834352159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=727dc781-a910-45ed-b517-5abbb42e6caf", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 527.8571428571429, 270, 1746, 416.5, 1269.0, 1746.0, 1746.0, 0.07981073454379614, 6.934954919405411, 0.1780376179346122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 923.2727272727274, 133, 2014, 1324.0, 1973.4, 2014.0, 2014.0, 0.12236498136715057, 79.86455117776295, 0.18678475582624174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18e8be21-0084-45ba-9532-68758717a58c", 3, 0, 0.0, 462.66666666666663, 273, 808, 307.0, 808.0, 808.0, 808.0, 0.025320729237002026, 0.025246547413065496, 0.016237577017218095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1282b2a-dfee-46b0-9c28-a47cbed67de7", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d50dbbf-4247-4e2b-a785-3fafcaf55d0f", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.7426417151162791, 1.3876271802325582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97fc4d6f-96ec-467c-951e-bea3a08c1c6e", 3, 0, 0.0, 557.6666666666666, 239, 1031, 403.0, 1031.0, 1031.0, 1031.0, 0.054411898068377616, 0.034485665865602616, 0.034893046612859344], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1014.4166666666663, 280, 1777, 1040.0, 1449.5, 1703.25, 1777.0, 0.10237946950371551, 0.0319935842199111, 0.046190737217496655], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 442.5294117647059, 273, 1407, 289.0, 738.1999999999994, 1407.0, 1407.0, 0.08536107735722105, 6.13165957625757, 0.19069433233829097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 144.14285714285714, 133, 167, 142.5, 163.0, 167.0, 167.0, 0.08987263763352507, 0.0697741669127465, 0.03194691415879211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 449.6190476190476, 274, 1251, 300.0, 768.6000000000001, 1206.0999999999995, 1251.0, 0.14188038807664244, 8.292190835878172, 0.317363678705105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 140.0, 127, 167, 137.5, 164.70000000000002, 167.0, 167.0, 0.049212598425196846, 0.0365730345718504, 0.024702417568897638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 219.49999999999997, 126, 433, 137.5, 431.9, 433.0, 433.0, 0.04921526263724906, 0.01316892769785766, 0.028068079472806106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 220.5, 129, 422, 137.5, 421.7, 422.0, 422.0, 0.04914487910359741, 0.013246080695891489, 0.02889181369176332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 217.3, 134, 402, 139.5, 401.7, 402.0, 402.0, 0.049155025118217836, 0.013248815363894651, 0.028945781392856793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 149.0, 143, 155, 149.0, 155.0, 155.0, 155.0, 0.07236020912100435, 0.021340608549358705, 0.0447304808335896], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1559.0, 1054, 3109, 1443.0, 2141.3, 2360.749999999998, 3109.0, 0.23365220868736886, 279.5292722407696, 0.46137184176353496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1014.4166666666663, 280, 1777, 1040.0, 1449.5, 1703.25, 1777.0, 0.09971622424516896, 0.0311613200766153, 0.04498915586061334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 167.44444444444446, 133, 404, 140.0, 404.0, 404.0, 404.0, 0.040004978397311666, 0.01078259183365041, 0.023557619114823177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 167.77777777777777, 130, 418, 136.0, 418.0, 418.0, 418.0, 0.03995436323843432, 0.010768949466609251, 0.023488795575720176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 266.92857142857144, 127, 1406, 140.5, 914.0, 1406.0, 1406.0, 0.09144350097975179, 5.900102312622469, 0.053197460809928154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 222.2857142857143, 127, 778, 139.0, 598.0, 778.0, 778.0, 0.09161823988272864, 1.9471304471951731, 0.05338858649416261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 165.8888888888889, 132, 396, 134.0, 396.0, 396.0, 396.0, 0.040004978397311666, 0.01070445711021816, 0.02281533924221681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 137.2142857142857, 128, 166, 135.5, 155.5, 166.0, 166.0, 0.0916122446308681, 0.06808292789461974, 0.045985052480728705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b971787d-b5e8-473e-b8d3-2f7b12972309", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 166.11111111111111, 131, 397, 137.0, 397.0, 397.0, 397.0, 0.040004978397311666, 0.029730262265970874, 0.020080623922088082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 174.7142857142857, 126, 420, 135.5, 414.5, 420.0, 420.0, 0.09145066889632106, 0.034281242651285536, 0.051606857657033864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 177.55555555555554, 139, 408, 147.0, 408.0, 408.0, 408.0, 0.04126755590607504, 0.03248208013700828, 0.014669326513487613], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 608.7142857142857, 141, 1031, 499.5, 1020.0, 1031.0, 1031.0, 0.09595613433858807, 0.017931534869773818, 0.0653071988519534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5174c20-d8a5-405d-bf49-c5870e72aa84", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1346.8571428571427, 876, 2672, 1280.0, 2065.4000000000005, 2620.499999999999, 2672.0, 0.09713093712853199, 0.05027284831847847, 0.04467643690189313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 368.3333333333333, 268, 802, 284.0, 802.0, 802.0, 802.0, 0.03993060947420261, 0.061884645737851116, 0.08980487658114122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c10b450-8763-468d-aa66-8b45bbcbbb3d", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/194a6c85-e8f4-4db9-b039-bb718ef6f498", 3, 0, 0.0, 378.0, 260, 482, 392.0, 482.0, 482.0, 482.0, 0.044302675881623246, 0.028482351844468075, 0.02841024462460866], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 1322.245901639344, 679, 3201, 1119.0, 2254.0, 2437.2, 3201.0, 0.27793978275133047, 82.84546441288637, 1.0114607088261829], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 259.73076923076917, 134, 1364, 145.0, 549.5, 597.7499999999998, 1364.0, 0.2347025821797551, 0.17442252445194692, 0.11345486150290897], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 884.8461538461538, 660, 1480, 813.5, 1148.5, 1213.3499999999995, 1480.0, 0.23463798066944022, 68.99135703101734, 0.1180064062937126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb196618-9946-4eaf-a53e-08d55d2faf3a", 3, 0, 0.0, 488.3333333333333, 226, 1009, 230.0, 1009.0, 1009.0, 1009.0, 0.018637244669748025, 0.025692946346478805, 0.011951618489389196], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 222.82692307692312, 130, 423, 145.0, 416.6, 420.0, 423.0, 0.23492100781112352, 0.41570006460327713, 0.11424869325189405], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1286.942307692308, 903, 1963, 1260.5, 1696.0, 1735.85, 1963.0, 0.2342838348659401, 210.80900643942635, 0.11759950304794257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 158.04761904761904, 130, 424, 144.0, 167.4, 398.39999999999964, 424.0, 0.1469302081511282, 0.1097671965191534, 0.05222909742872135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 213.90804597701154, 127, 919, 147.5, 401.0, 451.25, 775.0, 0.7065932459431802, 1.4599104144331823, 0.34323166664636223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 186.39999999999998, 135, 423, 148.0, 409.20000000000005, 423.0, 423.0, 0.05096969851423329, 0.03947165129080762, 0.018118135018731364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4546cfc-3258-4c6f-a0a4-031eeef85591", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1188c16f-db94-4d93-a8a8-5dbc1910e895", 3, 0, 0.0, 484.0, 459, 516, 477.0, 516.0, 516.0, 516.0, 0.020505109189706435, 0.028267948378387614, 0.013149435255117733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4546cfc-3258-4c6f-a0a4-031eeef85591", 3, 0, 0.0, 343.3333333333333, 225, 487, 318.0, 487.0, 487.0, 487.0, 0.03811944091486658, 0.03177860943456162, 0.02444508418043202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 146.2857142857143, 130, 188, 145.0, 176.5, 188.0, 188.0, 0.07674555012854879, 0.06228081265314849, 0.02728064477225758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 417.6, 269, 601, 408.0, 597.1, 601.0, 601.0, 0.04911036572489356, 0.07611147500527937, 0.11045036353948229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 428.4285714285714, 267, 1537, 282.0, 1045.0, 1537.0, 1537.0, 0.09135995823544765, 7.938495935705429, 0.20380102290524665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5174c20-d8a5-405d-bf49-c5870e72aa84", 3, 0, 0.0, 315.3333333333333, 225, 475, 246.0, 475.0, 475.0, 475.0, 0.059575820160457545, 0.038301511984669155, 0.03820454613154341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7113d40-c3f2-456b-8218-ad436efb0e6a", 3, 0, 0.0, 443.3333333333333, 349, 493, 488.0, 493.0, 493.0, 493.0, 0.019382349140715856, 0.022909280511047937, 0.012429436135159582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=194a6c85-e8f4-4db9-b039-bb718ef6f498", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18e8be21-0084-45ba-9532-68758717a58c", 1, 0, 0.0, 1354.0, 1354, 1354, 1354.0, 1354.0, 1354.0, 1354.0, 0.7385524372230429, 0.13342988367799113, 0.5091972858197932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 189.91666666666666, 134, 413, 145.5, 412.7, 413.0, 413.0, 0.0607149181613499, 0.05033883351463482, 0.021582256065167345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97fc4d6f-96ec-467c-951e-bea3a08c1c6e", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1282b2a-dfee-46b0-9c28-a47cbed67de7", 3, 0, 0.0, 434.0, 219, 720, 363.0, 720.0, 720.0, 720.0, 0.017666908114410896, 0.024355259070485073, 0.011329364904098135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 163.625, 135, 439, 146.0, 249.30000000000018, 439.0, 439.0, 0.12367723334029017, 0.09601894580618231, 0.04396339153893127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/727dc781-a910-45ed-b517-5abbb42e6caf", 3, 0, 0.0, 378.3333333333333, 264, 572, 299.0, 572.0, 572.0, 572.0, 0.030657605640999435, 0.030747422845025803, 0.01965998799243779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 152.95238095238096, 127, 395, 138.0, 184.40000000000003, 374.6999999999997, 395.0, 0.14226871172294184, 0.10572899377066283, 0.07141222443905479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 203.71428571428575, 128, 422, 140.0, 411.0, 421.0, 422.0, 0.14201087397549297, 0.0481558450999486, 0.08042263873109903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 267.7142857142857, 132, 1123, 143.0, 479.80000000000007, 1060.099999999999, 1123.0, 0.14227063940490223, 6.132490432722925, 0.0830573664010948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 231.5238095238095, 126, 1040, 140.0, 403.4, 976.3999999999991, 1040.0, 0.1422638927465738, 2.028438065244931, 0.08319235729576663], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.6201550387596899], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 13.793103448275861, 0.31007751937984496], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 16, 55.172413793103445, 1.2403100775193798], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 29, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
