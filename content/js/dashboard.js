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

    var data = {"OkPercent": 98.89380530973452, "KoPercent": 1.1061946902654867};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.784629981024668, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22de65f2-60df-47e2-8bc9-1d2ea7818779"], "isController": false}, {"data": [0.15833333333333333, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaaae009-c717-41ea-8aa9-0031b31da324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f00d9ad-e56a-492f-adf2-1a5071fddbd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac82962b-dbc6-4430-b188-8c70354c6372"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49277c71-c733-4214-9f74-8be8f4ac3f1b"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcb9c7ca-1654-4dfa-8eb3-633781ea60ce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/58acad96-864c-40cf-ae83-2d72a10ca335"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/197a3edc-c31e-494d-8cf2-5e4c72783421"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ebfe11a4-3d13-4d96-b7b6-eb91a8538282"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=deaa70d5-e286-433f-8b7a-8c8a9cbdc640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef4b4b93-269f-4318-a22e-bb3e682834fb"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31bfdc9c-63f4-44cf-8e9d-f2b2c1a45b0b"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22de65f2-60df-47e2-8bc9-1d2ea7818779"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/14d3d75e-9d52-4413-8b03-05bdea437788"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2194f2f-4470-4275-a810-f273bb781220"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac82962b-dbc6-4430-b188-8c70354c6372"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaaae009-c717-41ea-8aa9-0031b31da324"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcb9c7ca-1654-4dfa-8eb3-633781ea60ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/49277c71-c733-4214-9f74-8be8f4ac3f1b"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58acad96-864c-40cf-ae83-2d72a10ca335"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0f00d9ad-e56a-492f-adf2-1a5071fddbd3"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=876c30ac-da06-4b87-b5f0-8a933fa07a4f"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9719101123595506, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebfe11a4-3d13-4d96-b7b6-eb91a8538282"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/876c30ac-da06-4b87-b5f0-8a933fa07a4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/290f4034-1b56-472d-ab6c-6c83a51aa09c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef4b4b93-269f-4318-a22e-bb3e682834fb"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31bfdc9c-63f4-44cf-8e9d-f2b2c1a45b0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deaa70d5-e286-433f-8b7a-8c8a9cbdc640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2194f2f-4470-4275-a810-f273bb781220"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fc5d11d-72fb-428d-ab11-08b64eb3d5ff"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1356, 15, 1.1061946902654867, 374.33628318584067, 92, 4163, 120.0, 1014.3, 1228.3499999999988, 2027.6400000000094, 5.260156640947759, 745.9506828190522, 3.8428952487906685], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/22de65f2-60df-47e2-8bc9-1d2ea7818779", 3, 0, 0.0, 444.6666666666667, 332, 505, 497.0, 505.0, 505.0, 505.0, 0.020576272813942482, 0.02432045787351079, 0.01319507078237848], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1631.7333333333333, 1226, 2348, 1595.5, 2012.8999999999999, 2062.8, 2348.0, 0.2613468072131719, 314.488647577914, 1.2850402092952347], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaaae009-c717-41ea-8aa9-0031b31da324", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f00d9ad-e56a-492f-adf2-1a5071fddbd3", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac82962b-dbc6-4430-b188-8c70354c6372", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49277c71-c733-4214-9f74-8be8f4ac3f1b", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 590.6666666666666, 100, 1768, 491.0, 1298.2000000000003, 1768.0, 1768.0, 0.07712796042821443, 0.01510924693544904, 0.0519308181476949], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 590.6666666666666, 100, 1768, 491.0, 1298.2000000000003, 1768.0, 1768.0, 0.07710813645055825, 0.015105363449201159, 0.05191747051898916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 129.10526315789474, 93, 289, 101.0, 287.0, 289.0, 289.0, 0.0838626241939257, 0.022439803739390272, 0.04782790286059825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 111.57894736842104, 94, 286, 103.0, 114.0, 286.0, 286.0, 0.08385744234800838, 0.06231983752620546, 0.04209250524109015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 150.0, 94, 306, 100.0, 304.0, 306.0, 306.0, 0.08386373467279902, 0.02260389723602786, 0.049384601570017395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 111.31578947368422, 93, 328, 100.0, 103.0, 328.0, 328.0, 0.08386151374446073, 0.02260329862643668, 0.04930139772867711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcb9c7ca-1654-4dfa-8eb3-633781ea60ce", 3, 0, 0.0, 443.0, 352, 537, 440.0, 537.0, 537.0, 537.0, 0.021846303969473433, 0.021910306813133995, 0.014009511334590708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58acad96-864c-40cf-ae83-2d72a10ca335", 3, 0, 0.0, 986.3333333333334, 321, 1964, 674.0, 1964.0, 1964.0, 1964.0, 0.04280699751719415, 0.03504544230330185, 0.02745110192346109], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 247.875, 94, 453, 211.0, 404.70000000000005, 453.0, 453.0, 0.07927228046532829, 0.17457900535583343, 0.05123861389940347], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 134.04761904761904, 95, 364, 101.0, 305.2, 358.49999999999994, 364.0, 0.09694037705190466, 0.07204260443017524, 0.04865952519988183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 164.8571428571429, 94, 334, 101.0, 303.8, 331.29999999999995, 334.0, 0.0969511181695629, 0.03287609531679932, 0.05490470224464922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 658.25, 554, 761, 659.0, 761.0, 761.0, 761.0, 0.06199435851337528, 18.228399809367346, 0.03535615758965934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1069.5, 930, 1277, 1035.5, 1277.0, 1277.0, 1277.0, 0.061831447474185376, 55.63604512536327, 0.03520286511469734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 320.0, 278, 422, 290.0, 422.0, 422.0, 422.0, 0.06246096189881324, 0.11052662398500936, 0.034585317770143655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 122.44444444444443, 95, 287, 100.0, 287.0, 287.0, 287.0, 0.05527882022713453, 0.041081232610204466, 0.027747376559323387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 152.55555555555554, 95, 388, 97.0, 388.0, 388.0, 388.0, 0.05524488831325079, 0.02400179392428995, 0.030991327319824936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 253.88888888888889, 97, 1108, 100.0, 1108.0, 1108.0, 1108.0, 0.05500213897207114, 5.512179965852839, 0.031810047821304165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 183.88888888888889, 95, 502, 99.0, 502.0, 502.0, 502.0, 0.0552062567090937, 1.8168345537494248, 0.0319820100444717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 194.5, 95, 286, 198.5, 286.0, 286.0, 286.0, 0.06261740763932373, 0.04653500704445836, 0.03516114198497182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/197a3edc-c31e-494d-8cf2-5e4c72783421", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.7750872269417476, 1.4482516686893205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 163.90476190476193, 94, 1054, 98.0, 315.40000000000003, 980.499999999999, 1054.0, 0.096949775399687, 4.178961819389493, 0.05659912018078825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 733.25, 94, 1315, 966.5, 1238.0, 1315.0, 1315.0, 0.09902951079421668, 55.701839260404284, 0.05289955312933254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 172.66666666666666, 96, 596, 103.0, 364.6, 574.3999999999996, 596.0, 0.09695067057547148, 1.3823495677615938, 0.056694321172179776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 527.1875, 94, 872, 667.0, 870.6, 872.0, 872.0, 0.09903196256591815, 18.209187806380136, 0.052997573716917136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebfe11a4-3d13-4d96-b7b6-eb91a8538282", 3, 0, 0.0, 716.3333333333334, 300, 996, 853.0, 996.0, 996.0, 996.0, 0.02422930615343612, 0.02863821961039276, 0.015537673542405326], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 487.26666666666665, 100, 970, 450.0, 858.4000000000001, 970.0, 970.0, 0.07732636365042297, 0.015148113816674656, 0.05257789986751416], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 399.3333333333333, 198, 1203, 216.0, 1203.0, 1203.0, 1203.0, 0.05490516657617482, 7.374045069516041, 0.12192211740249757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 683.2380952380951, 180, 1855, 352.0, 1728.0, 1843.6999999999998, 1855.0, 0.08688241086278371, 0.05336819964129976, 0.039283746317840686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 113.6875, 96, 309, 101.0, 169.70000000000016, 309.0, 309.0, 0.09902399475172827, 0.07359107422467306, 0.04970540361561361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=deaa70d5-e286-433f-8b7a-8c8a9cbdc640", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 158.68749999999997, 97, 290, 102.5, 290.0, 290.0, 290.0, 0.09902705914391106, 0.119456225397965, 0.051278416124080906], "isController": false}, {"data": ["login", 21, 0, 0.0, 3493.571428571428, 1720, 5738, 3526.0, 5156.0, 5684.599999999999, 5738.0, 0.08622459453910902, 19.76837565438308, 0.15732860937179224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 108.95238095238095, 98, 136, 105.0, 134.0, 135.9, 136.0, 0.09791168366133747, 0.07926639233911012, 0.034804543801491054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef4b4b93-269f-4318-a22e-bb3e682834fb", 3, 0, 0.0, 420.66666666666663, 198, 783, 281.0, 783.0, 783.0, 783.0, 0.018228328036991356, 0.02512922175672473, 0.011689390049763335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 849.8125, 195, 1416, 1070.0, 1341.8000000000002, 1416.0, 1416.0, 0.09896274671103497, 74.05367115065842, 0.20674419521638823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31bfdc9c-63f4-44cf-8e9d-f2b2c1a45b0b", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 277.3684210526316, 194, 576, 208.0, 428.0, 576.0, 576.0, 0.08381933844484248, 0.1299036036249658, 0.1885116566781955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 680.0, 94, 1373, 630.5, 1373.0, 1373.0, 1373.0, 0.12176930804590702, 72.85550454351731, 0.177629788958568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22de65f2-60df-47e2-8bc9-1d2ea7818779", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1260.8749999999998, 173, 2483, 1298.5, 1999.0, 2400.0, 2483.0, 0.09435445824815224, 0.029900411817895895, 0.042570077842428056], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/14d3d75e-9d52-4413-8b03-05bdea437788", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.5764186597472923, 1.0770391471119132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 377.7142857142857, 192, 1159, 380.0, 669.4000000000001, 1111.4999999999993, 1159.0, 0.09689654217768058, 5.663112639923221, 0.2167420282407279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 121.70588235294116, 98, 293, 105.0, 206.5999999999999, 293.0, 293.0, 0.08416508238276299, 0.0653430082952115, 0.029918056628247782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2194f2f-4470-4275-a810-f273bb781220", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac82962b-dbc6-4430-b188-8c70354c6372", 3, 0, 0.0, 1317.6666666666667, 201, 3360, 392.0, 3360.0, 3360.0, 3360.0, 0.0184211819030309, 0.025395086379992143, 0.011813062613597288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 492.84615384615387, 199, 1236, 383.0, 1223.2, 1236.0, 1236.0, 0.07518970942069221, 20.848030119985427, 0.1646638821169952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 133.25, 97, 304, 101.0, 300.40000000000003, 304.0, 304.0, 0.10092005449682943, 0.07500015768758515, 0.05065713672985383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 115.16666666666667, 94, 301, 98.0, 241.60000000000022, 301.0, 301.0, 0.10092175200161475, 0.027004453172307073, 0.057556936688420914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 148.75, 94, 318, 98.0, 315.0, 318.0, 318.0, 0.10092090324208403, 0.02720133720196796, 0.0593304528825533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 177.0, 95, 296, 101.5, 294.2, 296.0, 296.0, 0.10092175200161475, 0.027201565969185226, 0.05942950825876337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 101.5, 100, 103, 101.5, 103.0, 103.0, 103.0, 0.049648735198470816, 0.01464249807611151, 0.030691063848273463], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1103.7333333333327, 756, 1904, 1036.5, 1568.7999999999997, 1628.75, 1904.0, 0.2610012006055228, 312.2481746228533, 0.515375417601921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaaae009-c717-41ea-8aa9-0031b31da324", 3, 0, 0.0, 311.6666666666667, 220, 460, 255.0, 460.0, 460.0, 460.0, 0.038654812524159254, 0.03222492671691792, 0.024788405166859942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1260.8749999999998, 173, 2483, 1298.5, 1999.0, 2400.0, 2483.0, 0.0940254652301665, 0.02979615572967679, 0.042421645445641525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 100.91666666666667, 94, 120, 98.0, 116.10000000000001, 120.0, 120.0, 0.06506251423242498, 0.0175363807892083, 0.03831317976772683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcb9c7ca-1654-4dfa-8eb3-633781ea60ce", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 125.08333333333333, 92, 389, 100.0, 307.7000000000003, 389.0, 389.0, 0.06506075047575674, 0.017535905401668807, 0.038248605260161675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 157.05882352941177, 95, 1053, 100.0, 304.9999999999993, 1053.0, 1053.0, 0.08487099608594935, 4.513710449179746, 0.04946582756709801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 162.58823529411765, 94, 554, 100.0, 357.1999999999998, 554.0, 554.0, 0.08478718416773898, 1.4879936515595853, 0.0494997789922295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 122.76470588235294, 96, 290, 102.0, 284.4, 290.0, 290.0, 0.08486930127603491, 0.06307181471783453, 0.04260041099207221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 114.91666666666667, 93, 280, 99.0, 229.00000000000017, 280.0, 280.0, 0.06506180871828238, 0.01740911678594665, 0.03710556278464541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 145.11764705882354, 93, 307, 100.0, 293.4, 307.0, 307.0, 0.08478887569950823, 0.030178761134774412, 0.04793727680575367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 102.91666666666666, 96, 131, 100.5, 124.10000000000002, 131.0, 131.0, 0.06506251423242498, 0.04835212239343303, 0.0326583323393227], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 775.0, 96, 4163, 505.0, 2285.6000000000013, 4163.0, 4163.0, 0.07860893626387447, 0.015112772707501387, 0.05349604236759634], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 139.75, 99, 316, 107.5, 311.5, 316.0, 316.0, 0.0652276717526132, 0.051341311945904515, 0.023186398943311717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49277c71-c733-4214-9f74-8be8f4ac3f1b", 3, 0, 0.0, 747.6666666666666, 195, 1034, 1014.0, 1034.0, 1034.0, 1034.0, 0.05931432638696666, 0.02683818804618609, 0.038036856439558696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1913.2380952380954, 1008, 4115, 1669.0, 3344.6000000000004, 4044.699999999999, 4115.0, 0.08597924215439415, 0.04450097494319229, 0.03954709282687465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 245.58333333333334, 196, 492, 209.0, 457.5000000000001, 492.0, 492.0, 0.06502620013980634, 0.100777909786985, 0.14624544816599022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58acad96-864c-40cf-ae83-2d72a10ca335", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f00d9ad-e56a-492f-adf2-1a5071fddbd3", 3, 0, 0.0, 1087.6666666666667, 190, 2447, 626.0, 2447.0, 2447.0, 2447.0, 0.027989774402418316, 0.028071775694612902, 0.01794917173592581], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 1092.6949152542377, 521, 4495, 840.0, 1826.0, 1993.0, 4495.0, 0.27024551117625506, 88.68840302508931, 0.9829545291888054], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=876c30ac-da06-4b87-b5f0-8a933fa07a4f", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 176.8833333333333, 94, 533, 103.5, 396.8, 406.79999999999995, 533.0, 0.2619847088258282, 0.1946976205238821, 0.12664299889529781], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 630.1499999999999, 459, 915, 591.0, 811.4, 817.85, 915.0, 0.2618532225403254, 76.99354177213533, 0.13169375938307382], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 153.43333333333334, 95, 416, 102.5, 305.6, 310.79999999999995, 416.0, 0.2623719297018143, 0.4642753287301636, 0.12759884862451515], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 924.3833333333332, 657, 1489, 907.5, 1170.6, 1204.8, 1489.0, 0.26149715839754545, 235.2956027890851, 0.1312593158362679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 108.23076923076924, 98, 129, 105.0, 125.8, 129.0, 129.0, 0.07839306281696426, 0.05856512993650162, 0.027866284048217765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, 1.1235955056179776, 184.15168539325848, 95, 3198, 109.0, 330.0, 382.15, 1256.9700000000196, 0.7457152792033415, 1.6202631500395899, 0.3573600893601511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 103.83333333333334, 97, 108, 104.5, 108.0, 108.0, 108.0, 0.0973630831643002, 0.07539934077079108, 0.034609533468559835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebfe11a4-3d13-4d96-b7b6-eb91a8538282", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 121.6842105263158, 99, 335, 106.0, 135.0, 335.0, 335.0, 0.08831992265034143, 0.07167368722893919, 0.03139497250461355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/876c30ac-da06-4b87-b5f0-8a933fa07a4f", 3, 0, 0.0, 406.6666666666667, 202, 617, 401.0, 617.0, 617.0, 617.0, 0.04601509295048776, 0.030122510391741825, 0.029508376664212528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/290f4034-1b56-472d-ab6c-6c83a51aa09c", 2, 0, 0.0, 223.0, 209, 237, 223.0, 237.0, 237.0, 237.0, 0.016025641025641024, 0.02691024389022436, 0.009961250500801282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 316.75, 194, 600, 206.0, 598.5, 600.0, 600.0, 0.10083779400519315, 0.15627888582640773, 0.2267865621034764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef4b4b93-269f-4318-a22e-bb3e682834fb", 1, 0, 0.0, 970.0, 970, 970, 970.0, 970.0, 970.0, 970.0, 1.0309278350515465, 0.1862516108247423, 0.7107764175257733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 340.41176470588243, 192, 1337, 208.0, 734.5999999999995, 1337.0, 1337.0, 0.08474491779742974, 6.087399583503654, 0.18931784858824938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31bfdc9c-63f4-44cf-8e9d-f2b2c1a45b0b", 3, 0, 0.0, 344.3333333333333, 191, 458, 384.0, 458.0, 458.0, 458.0, 0.044221046269954746, 0.02750860007222771, 0.0283578975103551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 105.11111111111111, 97, 120, 103.0, 120.0, 120.0, 120.0, 0.05727996537744315, 0.04749090879438402, 0.020361237692762997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/deaa70d5-e286-433f-8b7a-8c8a9cbdc640", 3, 0, 0.0, 278.3333333333333, 191, 427, 217.0, 427.0, 427.0, 427.0, 0.04365414277814965, 0.036392662648060306, 0.02799435588312331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 130.625, 99, 309, 106.0, 306.9, 309.0, 309.0, 0.10418701569316924, 0.08088738034772416, 0.03703522823468126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2194f2f-4470-4275-a810-f273bb781220", 3, 0, 0.0, 1617.0, 235, 4163, 453.0, 4163.0, 4163.0, 4163.0, 0.015663506119209723, 0.021593407687126687, 0.010044631202748424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 101.07692307692307, 95, 109, 101.0, 107.4, 109.0, 109.0, 0.07567378776413063, 0.056238039539554106, 0.03798469424879213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 142.15384615384613, 94, 291, 101.0, 290.6, 291.0, 291.0, 0.07567643086666978, 0.04647915405392819, 0.04169252884436269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 374.00000000000006, 98, 1131, 102.0, 1120.6, 1131.0, 1131.0, 0.07523452917652913, 15.637789643894717, 0.042737643451991686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fc5d11d-72fb-428d-ab11-08b64eb3d5ff", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 286.9230769230769, 94, 809, 106.0, 796.2, 809.0, 809.0, 0.07536362951239732, 5.129335129741387, 0.04288457734047548], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.3687315634218289], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 13.333333333333334, 0.14749262536873156], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 13.333333333333334, 0.14749262536873156], "isController": false}, {"data": ["401/Unauthorized", 6, 40.0, 0.4424778761061947], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1356, 15, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
