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

    var data = {"OkPercent": 99.31087289433384, "KoPercent": 0.6891271056661562};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7307944845699278, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90d82d5d-1119-451d-9d5c-04042061c18d"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f5bfea8-ef55-493d-acfb-facd08d84b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=736b57e7-9ac1-46f3-b057-c6fe22ff26f3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37c44de6-11e9-4827-a041-d9200dadea89"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/469a7c81-073f-4d29-9e2a-d25484f6416c"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/025e1fc6-df2a-40c7-8dbd-83c34d9dd891"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc377f53-5ed5-433c-a94a-53d3d8853052"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1e03545-ccb2-4c30-a2ed-722573ed1059"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f5252cb-811b-47c5-a855-5081cc4d89fc"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=336d59af-b824-4ab6-a80f-69475104f47c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56b8644c-a7d3-49d0-9b3a-9e54070895cb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9693cee0-4db4-43e3-89ce-acf56e64b458"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b9dfc8e-808c-483f-b5f5-350a7ad49fbd"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/092881e7-cf08-4c23-93d2-86acbf1329f7"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9693cee0-4db4-43e3-89ce-acf56e64b458"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b150c9c3-8739-4846-92e6-422663512225"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37c44de6-11e9-4827-a041-d9200dadea89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f10c45af-1038-445b-95cd-c75f205a370a"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90d82d5d-1119-451d-9d5c-04042061c18d"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9626436781609196, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/736b57e7-9ac1-46f3-b057-c6fe22ff26f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56b8644c-a7d3-49d0-9b3a-9e54070895cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc377f53-5ed5-433c-a94a-53d3d8853052"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=092881e7-cf08-4c23-93d2-86acbf1329f7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f10c45af-1038-445b-95cd-c75f205a370a"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1e03545-ccb2-4c30-a2ed-722573ed1059"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b150c9c3-8739-4846-92e6-422663512225"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/336d59af-b824-4ab6-a80f-69475104f47c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f5252cb-811b-47c5-a855-5081cc4d89fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55b6d4ef-8890-47b3-8dcd-53d794d3035b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81390b3e-d635-41a1-b71d-e166ec16e2a1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=025e1fc6-df2a-40c7-8dbd-83c34d9dd891"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b9dfc8e-808c-483f-b5f5-350a7ad49fbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 9, 0.6891271056661562, 500.4663093415014, 137, 3298, 168.0, 1401.8999999999999, 1673.0, 2205.2000000000025, 5.260147735236546, 755.0880470908584, 3.8315176895626744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2346.6785714285706, 1708, 3144, 2280.0, 2709.1, 2967.1, 3144.0, 0.24209202090637522, 291.31926168958614, 1.1903645754527337], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 895.3571428571429, 484, 1802, 771.0, 1672.5, 1802.0, 1802.0, 0.08238831969021992, 0.014884608537783872, 0.05599831103944635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 895.3571428571429, 484, 1802, 771.0, 1672.5, 1802.0, 1802.0, 0.08332638946754438, 0.015054084034663778, 0.05663590534122156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 191.2941176470588, 139, 433, 141.0, 427.4, 433.0, 433.0, 0.0981711296032154, 0.04361532148157559, 0.05501824106209613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 159.76470588235296, 142, 419, 143.0, 206.19999999999982, 419.0, 419.0, 0.09816432708353784, 0.07295220010798076, 0.049273890743103954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 273.23529411764713, 140, 1101, 143.0, 895.3999999999999, 1101.0, 1101.0, 0.09816999578446488, 3.4192573439818905, 0.05681656178357558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90d82d5d-1119-451d-9d5c-04042061c18d", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 322.29411764705884, 140, 1651, 143.0, 1251.7999999999997, 1651.0, 1651.0, 0.09817056269056638, 10.41558766270327, 0.056721020194262214], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 388.14285714285717, 242, 741, 357.0, 654.0, 741.0, 741.0, 0.08225713580653121, 0.17557675472097203, 0.05317795303117545], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7f5bfea8-ef55-493d-acfb-facd08d84b7d", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 172.05263157894737, 140, 430, 143.0, 420.0, 430.0, 430.0, 0.1096174926440893, 0.08146378115444528, 0.055022842987365136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=736b57e7-9ac1-46f3-b057-c6fe22ff26f3", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 193.68421052631578, 138, 567, 142.0, 430.0, 567.0, 567.0, 0.10944448284601738, 0.037936553881246976, 0.06193378680790765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 980.0, 839, 1121, 980.0, 1121.0, 1121.0, 1121.0, 0.046637984306318284, 13.713115912880246, 0.026598225424697145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1396.0, 1128, 1661, 1397.5, 1661.0, 1661.0, 1661.0, 0.04619524419960965, 41.56656193338646, 0.0263006126644262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 363.5, 178, 430, 423.0, 430.0, 430.0, 430.0, 0.046865297418893746, 0.08292960832327682, 0.025949827770031984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 169.47619047619048, 140, 422, 143.0, 365.0000000000002, 421.6, 422.0, 0.09774443089468736, 0.07264014835044637, 0.04906312253893486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 168.66666666666663, 139, 428, 142.0, 367.0000000000002, 427.4, 428.0, 0.09761857170084091, 0.03310242861060882, 0.05528269001919832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 254.19047619047615, 139, 1401, 142.0, 421.6, 1303.0999999999985, 1401.0, 0.09768714065087547, 4.2107455055193235, 0.057029592807435386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 267.3809523809524, 140, 1117, 142.0, 423.0, 1047.599999999999, 1117.0, 0.09761857170084091, 1.3918726873695515, 0.057084893003072665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 218.75, 140, 453, 141.0, 453.0, 453.0, 453.0, 0.04702120656416044, 0.03494447089387314, 0.026403509545304932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37c44de6-11e9-4827-a041-d9200dadea89", 3, 0, 0.0, 333.3333333333333, 250, 500, 250.0, 500.0, 500.0, 500.0, 0.03932930426460756, 0.03278722272840494, 0.02522094056031149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 243.8421052631579, 139, 1516, 143.0, 423.0, 1516.0, 1516.0, 0.10944385242360531, 5.210986551726621, 0.06384599737910775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 11, 0, 0.0, 1397.090909090909, 140, 1687, 1538.0, 1685.2, 1687.0, 1687.0, 0.14063618696941804, 115.04407166532424, 0.07169149374808224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 214.99999999999997, 139, 1108, 142.0, 563.0, 1108.0, 1108.0, 0.10961938993924779, 1.7243981931551344, 0.06405545046357464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 11, 0, 0.0, 1085.0909090909092, 142, 1279, 1124.0, 1278.6, 1279.0, 1279.0, 0.14063259096371677, 37.59494697512081, 0.07182699714260145], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 590.5, 243, 1396, 529.5, 1173.5, 1396.0, 1396.0, 0.08387100639216884, 0.015152476740772691, 0.057825127453975785], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/469a7c81-073f-4d29-9e2a-d25484f6416c", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 491.38095238095235, 282, 1823, 290.0, 784.8000000000002, 1724.3999999999987, 1823.0, 0.09755236471577422, 5.701442149125048, 0.21820899810237424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 710.8636363636363, 157, 1330, 590.5, 1308.7, 1329.1, 1330.0, 0.09348892156279481, 0.05742630045214642, 0.04227086980817773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 11, 0, 0.0, 145.0, 141, 152, 144.0, 151.8, 152.0, 152.0, 0.14062899514190744, 0.1045104153349527, 0.07058916357709026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 11, 0, 0.0, 218.0, 139, 423, 143.0, 422.6, 423.0, 423.0, 0.14062899514190744, 0.22964575076706725, 0.0694655299156226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/025e1fc6-df2a-40c7-8dbd-83c34d9dd891", 3, 0, 0.0, 452.0, 275, 560, 521.0, 560.0, 560.0, 560.0, 0.04764249074941638, 0.030629530999380646, 0.03055198788292652], "isController": false}, {"data": ["login", 22, 0, 0.0, 3076.5, 1930, 4276, 3115.5, 4140.4, 4259.8, 4276.0, 0.09306575518630072, 20.373105107194828, 0.16847512553301297], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cc377f53-5ed5-433c-a94a-53d3d8853052", 3, 0, 0.0, 378.6666666666667, 240, 478, 418.0, 478.0, 478.0, 478.0, 0.03440248615299932, 0.03450327468665069, 0.022061490143687718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 191.26315789473685, 141, 435, 146.0, 425.0, 435.0, 435.0, 0.11040991132340806, 0.08938458641318875, 0.03924727316574271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1e03545-ccb2-4c30-a2ed-722573ed1059", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f5252cb-811b-47c5-a855-5081cc4d89fc", 3, 0, 0.0, 380.66666666666663, 240, 660, 242.0, 660.0, 660.0, 660.0, 0.037791466686822116, 0.031505190815413885, 0.024234762165702986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 11, 0, 0.0, 1543.7272727272727, 287, 1832, 1685.0, 1830.2, 1832.0, 1832.0, 0.1403705783267827, 152.6852428052103, 0.2830466038295646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=336d59af-b824-4ab6-a80f-69475104f47c", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56b8644c-a7d3-49d0-9b3a-9e54070895cb", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.2633586916909621, 1.0050337099125364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9693cee0-4db4-43e3-89ce-acf56e64b458", 3, 0, 0.0, 562.6666666666667, 242, 1079, 367.0, 1079.0, 1079.0, 1079.0, 0.05310486440557955, 0.034487045732139066, 0.03405487723925512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b9dfc8e-808c-483f-b5f5-350a7ad49fbd", 3, 0, 0.0, 595.6666666666666, 378, 935, 474.0, 935.0, 935.0, 935.0, 0.09074135688575663, 0.04099902453041348, 0.05819025815916034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 533.1176470588235, 284, 2071, 289.0, 1450.1999999999994, 2071.0, 2071.0, 0.09808277031899978, 13.938960108078557, 0.21763804969623188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1615.5, 1269, 2009, 1592.0, 2009.0, 2009.0, 2009.0, 0.04612014297244322, 55.17572495099735, 0.10399551769860486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/092881e7-cf08-4c23-93d2-86acbf1329f7", 3, 0, 0.0, 1092.6666666666667, 440, 2097, 741.0, 2097.0, 2097.0, 2097.0, 0.019396259108160004, 0.02673930902443282, 0.012438356264021878], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1476.1666666666663, 369, 2983, 1396.0, 2663.0, 2930.75, 2983.0, 0.09843609651659263, 0.031193860663705383, 0.04441159823307207], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9693cee0-4db4-43e3-89ce-acf56e64b458", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 462.0526315789474, 281, 1936, 287.0, 851.0, 1936.0, 1936.0, 0.10935188862222375, 7.045968890107107, 0.24446239697901018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 190.06249999999997, 143, 440, 151.0, 429.5, 440.0, 440.0, 0.08135579431221303, 0.06316196921700133, 0.028919442509419475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 569.2857142857142, 283, 1688, 561.0, 1498.4000000000005, 1685.2, 1688.0, 0.09757684176288828, 11.254520370617755, 0.21707489458216203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 190.33333333333334, 141, 430, 142.0, 430.0, 430.0, 430.0, 0.030173952838111712, 0.022424197372854504, 0.015145909920692794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 234.16666666666669, 140, 424, 142.0, 424.0, 424.0, 424.0, 0.030132432038810573, 0.015605696410725137, 0.016763127068465906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b150c9c3-8739-4846-92e6-422663512225", 3, 0, 0.0, 476.3333333333333, 425, 514, 490.0, 514.0, 514.0, 514.0, 0.01992269992429374, 0.02746505018860156, 0.01277595014676389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 416.66666666666663, 138, 1793, 142.0, 1793.0, 1793.0, 1793.0, 0.030173801094303183, 4.5318505293616225, 0.017306717945365303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 302.5, 137, 837, 142.5, 837.0, 837.0, 837.0, 0.03013228071232712, 1.48341649528932, 0.017312329250409295], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1636.3035714285716, 1113, 2548, 1555.5, 2120.5, 2361.7499999999995, 2548.0, 0.24757618493941014, 296.18718859557987, 0.48886625580809306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1476.1666666666663, 369, 2983, 1396.0, 2663.0, 2930.75, 2983.0, 0.10075735948546576, 0.03192945620413441, 0.04545888679910662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 207.75, 138, 413, 140.0, 413.0, 413.0, 413.0, 0.06122292798653095, 0.016501492308869672, 0.036052173413943525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 212.75, 140, 417, 147.0, 417.0, 417.0, 417.0, 0.061215432410510695, 0.01649947201689546, 0.035987978819460385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 227.50000000000006, 138, 1519, 142.0, 557.200000000001, 1519.0, 1519.0, 0.07916755317832987, 4.472198465943108, 0.04611664596765016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 238.0, 139, 1121, 142.0, 633.8000000000005, 1121.0, 1121.0, 0.07916794489911036, 1.4748798719211091, 0.046194186598846124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 143.56249999999997, 140, 152, 143.0, 151.3, 152.0, 152.0, 0.0791671614614258, 0.05883418932826663, 0.03973820409294224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 140.75, 139, 143, 140.5, 143.0, 143.0, 143.0, 0.06122199093914534, 0.0163816655442635, 0.03491566670748133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 141.93749999999997, 139, 146, 142.0, 145.3, 146.0, 146.0, 0.07916676974839812, 0.028614844387818215, 0.04473425014225279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 141.75, 140, 143, 142.0, 143.0, 143.0, 143.0, 0.061218243036424855, 0.04549519819406183, 0.03072868839914294], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 831.0000000000001, 461, 2097, 700.5, 1705.5, 2097.0, 2097.0, 0.08242664029014178, 0.01489153169304319, 0.056104851838114075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 154.0, 145, 172, 149.5, 172.0, 172.0, 172.0, 0.05511463844797178, 0.04338124862213404, 0.019591531635802472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1802.5454545454547, 1162, 2721, 1762.0, 2513.7999999999997, 2694.1499999999996, 2721.0, 0.09331325684473947, 0.048296900515343674, 0.04292045309948466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 356.25, 284, 561, 290.0, 561.0, 561.0, 561.0, 0.06108082520194847, 0.0946633492143479, 0.1373722074610228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37c44de6-11e9-4827-a041-d9200dadea89", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f10c45af-1038-445b-95cd-c75f205a370a", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1503.2203389830509, 735, 5272, 1186.0, 2522.0, 2702.0, 5272.0, 0.2866234302509169, 105.71599686657437, 1.0391949570672108], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/90d82d5d-1119-451d-9d5c-04042061c18d", 3, 0, 0.0, 468.66666666666663, 318, 741, 347.0, 741.0, 741.0, 741.0, 0.07147792523409022, 0.03234189976412285, 0.04583708096066332], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 256.12499999999994, 139, 629, 144.0, 569.9, 574.6, 629.0, 0.24909591527180366, 0.18511913234554941, 0.12041257623002229], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 924.125, 693, 1329, 845.5, 1230.2, 1282.85, 1329.0, 0.24899955535793686, 73.21413683859492, 0.12522926856380615], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 220.80357142857144, 138, 439, 146.5, 426.0, 428.2, 439.0, 0.24961443484617513, 0.44170054291139577, 0.121394520071675], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1376.3214285714284, 968, 2104, 1388.0, 1655.6, 1758.9499999999996, 2104.0, 0.2482434559035397, 223.36989798745483, 0.12460657845158143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 150.99999999999994, 141, 183, 149.0, 161.4, 180.89999999999998, 183.0, 0.09814505839630976, 0.07332125944646187, 0.03488750122681323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 231.55172413793102, 140, 3298, 156.0, 409.0, 447.0, 1289.5, 0.7236612267305486, 1.568411914520637, 0.34841955143401376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 194.5, 142, 421, 147.0, 421.0, 421.0, 421.0, 0.030942668392579947, 0.023962437534488183, 0.010999151655174903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/736b57e7-9ac1-46f3-b057-c6fe22ff26f3", 3, 0, 0.0, 383.3333333333333, 312, 461, 377.0, 461.0, 461.0, 461.0, 0.021006785191616893, 0.024829308929284158, 0.01347114805582203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 149.5294117647059, 141, 208, 145.0, 166.39999999999998, 208.0, 208.0, 0.1043969540653402, 0.08472057502763448, 0.037109854765413904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56b8644c-a7d3-49d0-9b3a-9e54070895cb", 3, 0, 0.0, 640.6666666666667, 275, 1314, 333.0, 1314.0, 1314.0, 1314.0, 0.08673779165582444, 0.04026305042356954, 0.05562286769595512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc377f53-5ed5-433c-a94a-53d3d8853052", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=092881e7-cf08-4c23-93d2-86acbf1329f7", 1, 0, 0.0, 1396.0, 1396, 1396, 1396.0, 1396.0, 1396.0, 1396.0, 0.7163323782234957, 0.12941551755014327, 0.4938775967048711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 654.3333333333333, 283, 1935, 288.0, 1935.0, 1935.0, 1935.0, 0.03011080777260318, 6.042720610283342, 0.06643589032640115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f10c45af-1038-445b-95cd-c75f205a370a", 3, 0, 0.0, 557.0, 551, 567, 553.0, 567.0, 567.0, 567.0, 0.019071594766754397, 0.022541979361355866, 0.012230156800294975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 408.25, 283, 1670, 288.5, 898.6000000000008, 1670.0, 1670.0, 0.07911118582723105, 6.030224065437311, 0.17665782743378144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1e03545-ccb2-4c30-a2ed-722573ed1059", 3, 0, 0.0, 530.3333333333334, 285, 1007, 299.0, 1007.0, 1007.0, 1007.0, 0.07091192738618636, 0.03287063300713847, 0.045474120101167685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b150c9c3-8739-4846-92e6-422663512225", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 160.2857142857143, 142, 420, 145.0, 169.60000000000002, 395.19999999999965, 420.0, 0.09885004448252002, 0.08195672633365185, 0.03513810174964579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/336d59af-b824-4ab6-a80f-69475104f47c", 3, 0, 0.0, 440.33333333333337, 253, 800, 268.0, 800.0, 800.0, 800.0, 0.01810304251801253, 0.02495650555461688, 0.011609047448074441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 11, 0, 0.0, 151.2727272727273, 144, 174, 145.0, 172.0, 174.0, 174.0, 0.14312108043404723, 0.1111145106885425, 0.05087507156054021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f5252cb-811b-47c5-a855-5081cc4d89fc", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55b6d4ef-8890-47b3-8dcd-53d794d3035b", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81390b3e-d635-41a1-b71d-e166ec16e2a1", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=025e1fc6-df2a-40c7-8dbd-83c34d9dd891", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b9dfc8e-808c-483f-b5f5-350a7ad49fbd", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 186.33333333333337, 140, 431, 144.0, 417.8, 429.7, 431.0, 0.0976412659887573, 0.07256347989984796, 0.04901133859201294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 223.04761904761904, 138, 431, 143.0, 425.8, 430.5, 431.0, 0.09764444403113463, 0.04009488656970418, 0.05490683673848958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 328.0, 138, 1537, 143.0, 1078.2000000000007, 1507.4999999999995, 1537.0, 0.09764399001241474, 8.391452939665314, 0.05660481675477874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 327.2857142857143, 138, 1112, 145.0, 968.4000000000004, 1111.3, 1112.0, 0.09764444403113463, 2.758164935415175, 0.05670043585457488], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 55.55555555555556, 0.38284839203675347], "isController": false}, {"data": ["401/Unauthorized", 4, 44.44444444444444, 0.30627871362940273], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 9, "406/Not Acceptable", 5, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
