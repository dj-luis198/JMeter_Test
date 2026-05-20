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

    var data = {"OkPercent": 98.31932773109244, "KoPercent": 1.680672268907563};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.756544502617801, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8345ea79-018e-4574-b4aa-a929318d57e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40286998-8643-42e3-91fd-19273d53534f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11a37e46-cebf-4057-95d3-f8ff087e14b5"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51dce409-7c07-436e-8b2d-433c116a279c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bf21f64-1c05-4323-8157-cb7731a23ca7"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=402f1b0c-02bc-4619-b85e-4d1cb7437267"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b5254c5-fd12-4ff4-8b44-7bbd0448a76e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02df432e-68bd-4561-a5e4-01ace465016d"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/670c9d06-311f-46df-9489-282176ebb3e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f847e9d3-9a65-416b-865d-de3fe9cff442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cea52bf7-0069-4658-b87a-7318dcd09197"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0bb70b7-2e2f-4b2e-b068-b5ced2e31cc0"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/581f6f4c-37f4-4a85-b30a-8b2f3bbb769e"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/247fddc1-0567-4f2b-a152-e1e7e64c4115"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1077b345-6815-4fe2-9d91-e8a48d24e62e"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11a37e46-cebf-4057-95d3-f8ff087e14b5"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a60ed46-4ecc-4615-81b9-c9c3e7c7fc68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bf21f64-1c05-4323-8157-cb7731a23ca7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51dce409-7c07-436e-8b2d-433c116a279c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02df432e-68bd-4561-a5e4-01ace465016d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/402f1b0c-02bc-4619-b85e-4d1cb7437267"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9127906976744186, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b5254c5-fd12-4ff4-8b44-7bbd0448a76e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=581f6f4c-37f4-4a85-b30a-8b2f3bbb769e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f847e9d3-9a65-416b-865d-de3fe9cff442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0bb70b7-2e2f-4b2e-b068-b5ced2e31cc0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a60ed46-4ecc-4615-81b9-c9c3e7c7fc68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=247fddc1-0567-4f2b-a152-e1e7e64c4115"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=670c9d06-311f-46df-9489-282176ebb3e2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40286998-8643-42e3-91fd-19273d53534f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 22, 1.680672268907563, 433.3651642475172, 108, 3993, 126.0, 1225.0, 1507.5, 2617.100000000021, 5.165603160133698, 730.3709230297012, 3.7741864803951746], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2188.125, 1338, 4452, 2005.5, 3674.4, 4099.1, 4452.0, 0.23454711465165565, 282.2393197623221, 1.1532663303428576], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8345ea79-018e-4574-b4aa-a929318d57e6", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40286998-8643-42e3-91fd-19273d53534f", 1, 0, 0.0, 1267.0, 1267, 1267, 1267.0, 1267.0, 1267.0, 1267.0, 0.7892659826361483, 0.14259199881610105, 0.5441618981846883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11a37e46-cebf-4057-95d3-f8ff087e14b5", 3, 0, 0.0, 412.3333333333333, 208, 630, 399.0, 630.0, 630.0, 630.0, 0.0195091497912521, 0.02305915458725142, 0.012510750354416221], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 680.8, 115, 1717, 511.0, 1680.4, 1717.0, 1717.0, 0.09458888517539932, 0.018529814810727643, 0.06368738609921744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 680.8, 115, 1717, 511.0, 1680.4, 1717.0, 1717.0, 0.09343000224232005, 0.018302791454891994, 0.0629071017701871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51dce409-7c07-436e-8b2d-433c116a279c", 3, 0, 0.0, 561.0, 195, 1031, 457.0, 1031.0, 1031.0, 1031.0, 0.046051823652216634, 0.0296068853232838, 0.029531931183224853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 158.94736842105263, 110, 337, 112.0, 335.0, 337.0, 337.0, 0.10195156763949927, 0.043398585690292604, 0.057242954610088916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 136.68421052631578, 109, 338, 114.0, 335.0, 338.0, 338.0, 0.10195047353312049, 0.07576592808467254, 0.05117435878517962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 210.42105263157896, 108, 655, 113.0, 551.0, 655.0, 655.0, 0.10182589914948578, 3.17615579094607, 0.05904080840385224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bf21f64-1c05-4323-8157-cb7731a23ca7", 3, 0, 0.0, 377.3333333333333, 256, 536, 340.0, 536.0, 536.0, 536.0, 0.033128305928862484, 0.02712164368850558, 0.021244388893183298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 310.84210526315786, 111, 1545, 113.0, 1335.0, 1545.0, 1545.0, 0.10182753630955571, 9.669251014925774, 0.05894231671043464], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 224.73333333333335, 111, 352, 218.0, 332.8, 352.0, 352.0, 0.09563947742589535, 0.18069385643876842, 0.06181697473205006], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 114.5, 110, 130, 113.5, 119.20000000000002, 130.0, 130.0, 0.10363947282054826, 0.07702113165667697, 0.05202215725562676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 149.16666666666666, 110, 336, 112.5, 336.0, 336.0, 336.0, 0.10364006955400223, 0.03637973361623234, 0.058623663474936374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1073.8333333333335, 815, 1993, 879.0, 1993.0, 1993.0, 1993.0, 0.04625596509216501, 13.600789579687465, 0.026380355091625358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1209.6666666666667, 997, 1436, 1148.0, 1436.0, 1436.0, 1436.0, 0.046058893972426074, 41.44387375928854, 0.0262229835800043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 261.5, 112, 344, 333.0, 344.0, 344.0, 344.0, 0.046531827770194815, 0.08233952335897755, 0.02576518197822311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 114.09090909090908, 111, 121, 113.0, 120.0, 121.0, 121.0, 0.054092064694109376, 0.040199278547087144, 0.02715168091091037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 133.0, 111, 332, 112.0, 290.40000000000015, 332.0, 332.0, 0.05403493604228479, 0.014458566870689485, 0.030816799461615547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 165.0, 110, 454, 113.0, 429.80000000000007, 454.0, 454.0, 0.05400257248618025, 0.014555380865415772, 0.031747606090508314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=402f1b0c-02bc-4619-b85e-4d1cb7437267", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 153.72727272727272, 111, 334, 113.0, 333.4, 334.0, 334.0, 0.054093394704748415, 0.01457986029151422, 0.03185382520211259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b5254c5-fd12-4ff4-8b44-7bbd0448a76e", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 150.16666666666666, 112, 335, 113.5, 335.0, 335.0, 335.0, 0.04653074518988422, 0.03457997762646669, 0.026128103988460376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 800.0, 110, 1559, 1215.5, 1542.8, 1559.0, 1559.0, 0.0882993544336087, 44.150529934094344, 0.047694681680827265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 223.16666666666669, 108, 1433, 113.0, 445.7000000000015, 1433.0, 1433.0, 0.10364066629432798, 5.207274360234804, 0.06043456387431842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02df432e-68bd-4561-a5e4-01ace465016d", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 499.05555555555554, 111, 1008, 663.5, 900.0000000000002, 1008.0, 1008.0, 0.08829978758995541, 14.434505012239331, 0.04778114591049345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 180.16666666666666, 111, 860, 113.0, 395.6000000000007, 860.0, 860.0, 0.10364066629432798, 1.719371214236773, 0.06053577546249648], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 566.2666666666665, 121, 1359, 469.0, 1303.8, 1359.0, 1359.0, 0.09296099356709925, 0.018210913388242295, 0.06320863390721253], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 300.2727272727273, 224, 569, 230.0, 544.6000000000001, 569.0, 569.0, 0.05397130689066395, 0.08364498440965203, 0.12138273414960846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 495.9545454545455, 133, 1179, 424.0, 1005.0999999999999, 1157.0999999999997, 1179.0, 0.09351236701053715, 0.05744070200158971, 0.04228147063074091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 114.55555555555556, 110, 131, 113.5, 120.20000000000002, 131.0, 131.0, 0.0882984881336643, 0.06562026315402199, 0.0443217020514682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/670c9d06-311f-46df-9489-282176ebb3e2", 3, 0, 0.0, 487.6666666666667, 218, 1003, 242.0, 1003.0, 1003.0, 1003.0, 0.06802104117540358, 0.030777749750589518, 0.04362026403500816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 175.55555555555554, 111, 343, 113.0, 342.1, 343.0, 343.0, 0.0882993544336087, 0.09730558199085611, 0.04623835552263407], "isController": false}, {"data": ["login", 22, 0, 0.0, 2601.5454545454545, 1574, 5265, 2548.5, 3746.4999999999995, 5058.149999999997, 5265.0, 0.09219448006503901, 30.20666525493869, 0.18079579813180457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 130.83333333333331, 110, 333, 116.0, 160.20000000000027, 333.0, 333.0, 0.10522992739135009, 0.0851910252025676, 0.03740595075239398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f847e9d3-9a65-416b-865d-de3fe9cff442", 3, 0, 0.0, 390.6666666666667, 195, 530, 447.0, 530.0, 530.0, 530.0, 0.04032149673395877, 0.03277434158355958, 0.025857209819628503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cea52bf7-0069-4658-b87a-7318dcd09197", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.8870442708333334, 1.6574435763888888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0bb70b7-2e2f-4b2e-b068-b5ced2e31cc0", 3, 0, 0.0, 308.3333333333333, 209, 503, 213.0, 503.0, 503.0, 503.0, 0.02238805970149254, 0.022453649720149255, 0.01435692630597015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 916.2222222222222, 225, 1674, 1329.5, 1655.1000000000001, 1674.0, 1674.0, 0.0882495697833473, 58.71476758495246, 0.18593119536493646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/581f6f4c-37f4-4a85-b30a-8b2f3bbb769e", 3, 0, 0.0, 289.0, 205, 457, 205.0, 457.0, 457.0, 457.0, 0.04139929621196439, 0.03451288984337266, 0.026548376802594354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 472.10526315789474, 223, 1657, 231.0, 1449.0, 1657.0, 1657.0, 0.10176318100991924, 12.956284637977484, 0.2261270355983675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 960.7, 111, 2108, 1261.5, 2052.1000000000004, 2108.0, 2108.0, 0.076697115421489, 55.06205755351541, 0.12409353596711227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/247fddc1-0567-4f2b-a152-e1e7e64c4115", 2, 0, 0.0, 271.5, 223, 320, 271.5, 320.0, 320.0, 320.0, 0.018149973228789487, 0.02584244235114753, 0.01128169722668409], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1164.083333333333, 183, 3265, 1200.0, 1681.5, 2880.25, 3265.0, 0.09600345612442049, 0.030141710101563655, 0.043314059306135015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 166.70000000000002, 113, 636, 116.0, 366.70000000000005, 622.6999999999998, 636.0, 0.09597389510053266, 0.07451098301262057, 0.03411572052401747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 376.72222222222223, 224, 1547, 232.5, 568.7000000000015, 1547.0, 1547.0, 0.10357149022112513, 7.035348580998659, 0.23146250136656826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1077b345-6815-4fe2-9d91-e8a48d24e62e", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 544.6428571428571, 223, 1656, 448.5, 1553.0, 1656.0, 1656.0, 0.08876771391433916, 15.288926029546968, 0.1963960902577434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 113.14285714285715, 112, 114, 113.0, 114.0, 114.0, 114.0, 0.04137971802677859, 0.03075191935388526, 0.020770678775160346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 177.57142857142858, 111, 345, 112.0, 345.0, 345.0, 345.0, 0.041323289806134735, 0.011057208405157148, 0.023567188717561218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 145.42857142857144, 110, 343, 112.0, 343.0, 343.0, 343.0, 0.04132377770168955, 0.011138049458658511, 0.024293861500407334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 175.14285714285714, 111, 333, 113.0, 333.0, 333.0, 333.0, 0.041380207255723764, 0.011153258986894296, 0.024367446264845147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 139.5, 121, 158, 139.5, 158.0, 158.0, 158.0, 0.15535187199005746, 0.04581666537206773, 0.09603294430635388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11a37e46-cebf-4057-95d3-f8ff087e14b5", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1612.8392857142853, 884, 3993, 1451.0, 2756.4, 3634.9, 3993.0, 0.24703230388502415, 295.53651777088635, 0.4877923031792175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1164.083333333333, 183, 3265, 1200.0, 1681.5, 2880.25, 3265.0, 0.09837355718782792, 0.03088583851160808, 0.044383382246852045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 143.0, 111, 329, 113.0, 329.0, 329.0, 329.0, 0.03295110056675893, 0.008881351324634242, 0.019403821915776987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 143.71428571428572, 111, 333, 112.0, 333.0, 333.0, 333.0, 0.03295048013556769, 0.008881184099039728, 0.019371278360948974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a60ed46-4ecc-4615-81b9-c9c3e7c7fc68", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 123.8, 111, 335, 113.0, 116.7, 324.09999999999985, 335.0, 0.09282637754344274, 0.025019609572256053, 0.054571757110500524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 135.20000000000002, 112, 335, 113.0, 313.30000000000047, 335.0, 335.0, 0.09282594670862399, 0.025019493448808813, 0.054662154165332294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 125.05000000000001, 112, 339, 113.0, 118.80000000000001, 327.99999999999983, 339.0, 0.09282508505098418, 0.06898426730839742, 0.04659384151973229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 112.85714285714285, 112, 113, 113.0, 113.0, 113.0, 113.0, 0.032984638582602956, 0.008825967745735557, 0.01881155169164075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 145.95000000000002, 111, 336, 112.5, 333.7, 335.9, 336.0, 0.092824654228163, 0.024837846932145177, 0.05293906061449921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 113.57142857142857, 113, 115, 113.0, 115.0, 115.0, 115.0, 0.03298432773228035, 0.024512766996352874, 0.016556586381242282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 148.99999999999997, 113, 340, 116.0, 340.0, 340.0, 340.0, 0.03474255764782959, 0.027346192836084613, 0.012349893538876921], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 496.92857142857144, 111, 1003, 478.0, 881.0, 1003.0, 1003.0, 0.0918357975939021, 0.01773168859792976, 0.062496515159466304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1395.7272727272725, 1044, 2408, 1311.0, 2171.2999999999997, 2387.2999999999997, 2408.0, 0.0929603650807065, 0.04811425145778754, 0.042758136672864024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bf21f64-1c05-4323-8157-cb7731a23ca7", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 259.0, 226, 447, 228.0, 447.0, 447.0, 447.0, 0.03293249778881801, 0.05103893944419353, 0.07406595938246861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51dce409-7c07-436e-8b2d-433c116a279c", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02df432e-68bd-4561-a5e4-01ace465016d", 3, 0, 0.0, 496.0, 229, 759, 500.0, 759.0, 759.0, 759.0, 0.03617595986880185, 0.03015840925260467, 0.023198776348157438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/402f1b0c-02bc-4619-b85e-4d1cb7437267", 3, 0, 0.0, 325.6666666666667, 206, 473, 298.0, 473.0, 473.0, 473.0, 0.01708895370032811, 0.02355850225289373, 0.010958736585171346], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1290.8620689655177, 581, 2899, 1039.0, 2227.1, 2579.0999999999995, 2899.0, 0.276231253184994, 86.5340026756926, 1.0044498012206564], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 196.42857142857136, 110, 551, 115.0, 453.0, 459.9, 551.0, 0.24995424944541403, 0.18575701545699225, 0.12082749362839837], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 813.6785714285713, 547, 1948, 679.0, 1105.8, 1743.05, 1948.0, 0.24857623522414032, 73.08966666370743, 0.12501636830120338], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 177.42857142857144, 108, 461, 115.0, 344.80000000000007, 449.3, 461.0, 0.25036884696204226, 0.44303549872580145, 0.12176141190146199], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1414.5000000000007, 769, 3658, 1218.0, 2642.7, 3519.75, 3658.0, 0.24757509040911785, 222.76850154071286, 0.12427109030301424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 120.85714285714286, 113, 151, 116.5, 146.0, 151.0, 151.0, 0.0910119225618556, 0.06799230542951126, 0.03235189434815961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 225.31395348837205, 110, 2108, 120.0, 441.1, 621.6999999999998, 2010.1800000000014, 0.7402657209628619, 1.6020569407443115, 0.35551062867711936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 147.42857142857144, 113, 347, 115.0, 347.0, 347.0, 347.0, 0.044943243104422416, 0.03480467947442087, 0.015975918447275153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b5254c5-fd12-4ff4-8b44-7bbd0448a76e", 3, 0, 0.0, 385.6666666666667, 229, 470, 458.0, 470.0, 470.0, 470.0, 0.022166723314959582, 0.026200316522336668, 0.014214988584137493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 132.7894736842105, 110, 384, 119.0, 131.0, 384.0, 384.0, 0.10365973419461842, 0.08412230382395304, 0.036847796139493266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=581f6f4c-37f4-4a85-b30a-8b2f3bbb769e", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 324.42857142857144, 226, 459, 236.0, 459.0, 459.0, 459.0, 0.04129525517518037, 0.06399958004200318, 0.09287399674652383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f847e9d3-9a65-416b-865d-de3fe9cff442", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0bb70b7-2e2f-4b2e-b068-b5ced2e31cc0", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 283.54999999999995, 226, 674, 228.0, 449.9, 662.7999999999998, 674.0, 0.09277556662677318, 0.1437840080436416, 0.20865442377095567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a60ed46-4ecc-4615-81b9-c9c3e7c7fc68", 3, 0, 0.0, 404.0, 332, 528, 352.0, 528.0, 528.0, 528.0, 0.04231192350004231, 0.027202489880398296, 0.027133622817409945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 120.72727272727273, 112, 149, 116.0, 144.4, 149.0, 149.0, 0.054094192742526394, 0.0448495797250048, 0.01922879507644493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=247fddc1-0567-4f2b-a152-e1e7e64c4115", 1, 0, 0.0, 1359.0, 1359, 1359, 1359.0, 1359.0, 1359.0, 1359.0, 0.7358351729212657, 0.13293897167034585, 0.507323859455482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 116.61111111111111, 113, 129, 116.0, 121.80000000000001, 129.0, 129.0, 0.09115631789246592, 0.0707707741450297, 0.0324032223758375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=670c9d06-311f-46df-9489-282176ebb3e2", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40286998-8643-42e3-91fd-19273d53534f", 3, 0, 0.0, 557.0, 232, 956, 483.0, 956.0, 956.0, 956.0, 0.03660634754066355, 0.02353435429453467, 0.02347477365075104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 161.64285714285714, 110, 343, 115.0, 340.0, 343.0, 343.0, 0.08883136000812172, 0.06601627438103577, 0.044589178754076725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 159.7857142857143, 109, 335, 113.0, 334.0, 335.0, 335.0, 0.08883192365530676, 0.04282967747666576, 0.049596171661347326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 333.7857142857143, 111, 1334, 113.0, 1329.5, 1334.0, 1334.0, 0.08883136000812172, 11.439181549885154, 0.051132560183246405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 269.92857142857144, 112, 875, 115.0, 769.0, 875.0, 875.0, 0.08883192365530676, 3.7518847040945174, 0.05121963455181122], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5347593582887701], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15278838808250572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15278838808250572], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8403361344537815], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 22, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
