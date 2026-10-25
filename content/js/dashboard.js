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

    var data = {"OkPercent": 99.00306748466258, "KoPercent": 0.9969325153374233};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7895957587806495, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13392857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08991a52-fb1d-42c5-bd9c-0679d0ac1c1a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c21b4e5e-3d8d-4386-b51a-2630af424ddc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baa3ea85-4777-4f69-8862-1345e5b16f4e"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35475bf4-db39-41d7-980f-0ae26cb4128c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fde151e9-cdfa-4d39-b870-f4057466d15f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc4e4ef1-8c83-4e3e-9a10-29b062a3dc51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.075, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7a7e2212-2e04-4138-9f74-83219b8c5bb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c2f996d-94ec-49d3-9d22-6aa99811ecc0"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d447942-c5ec-4698-9ee7-b6a5a218e162"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7aaeab5-064e-417e-96b5-30717776d7fa"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=126c460f-ec78-40ed-b915-a0f0725b30c0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5af01052-1acc-4e42-b476-4937ad535a16"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37d4d581-6350-4280-91e1-b995f9084e1a"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c21b4e5e-3d8d-4386-b51a-2630af424ddc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/baa3ea85-4777-4f69-8862-1345e5b16f4e"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08991a52-fb1d-42c5-bd9c-0679d0ac1c1a"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fde151e9-cdfa-4d39-b870-f4057466d15f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5178571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5212c90a-74d1-4a34-8a73-3b37caa85b0a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.952247191011236, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9473881f-1f7b-40ac-bb85-1723dadaf1df"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d447942-c5ec-4698-9ee7-b6a5a218e162"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35475bf4-db39-41d7-980f-0ae26cb4128c"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c2f996d-94ec-49d3-9d22-6aa99811ecc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37d4d581-6350-4280-91e1-b995f9084e1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1884b12e-95d5-4ef3-b98a-8166c106fd76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7aaeab5-064e-417e-96b5-30717776d7fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5af01052-1acc-4e42-b476-4937ad535a16"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/126c460f-ec78-40ed-b915-a0f0725b30c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 13, 0.9969325153374233, 367.8052147239262, 98, 3216, 118.0, 996.0, 1272.25, 1642.0, 5.110458804764013, 715.9664162589207, 3.7378833578927977], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1751.642857142857, 1276, 2288, 1766.5, 2168.4, 2226.2, 2288.0, 0.24848248198502004, 299.00763608714414, 1.2217864226509532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/08991a52-fb1d-42c5-bd9c-0679d0ac1c1a", 3, 0, 0.0, 446.0, 246, 800, 292.0, 800.0, 800.0, 800.0, 0.018399941120188414, 0.021748107489389365, 0.011799441408454158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c21b4e5e-3d8d-4386-b51a-2630af424ddc", 1, 0, 0.0, 956.0, 956, 956, 956.0, 956.0, 956.0, 956.0, 1.0460251046025104, 0.188979144874477, 0.7211852771966527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baa3ea85-4777-4f69-8862-1345e5b16f4e", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 618.0, 112, 1157, 608.5, 1098.2000000000003, 1157.0, 1157.0, 0.05820665302044024, 0.011070064136455797, 0.03933022786692019], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 618.0, 112, 1157, 608.5, 1098.2000000000003, 1157.0, 1157.0, 0.05966824456024504, 0.011348037722761446, 0.040317825080054895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 136.21428571428572, 102, 318, 108.5, 310.0, 318.0, 318.0, 0.1193968752132087, 0.057566350549225626, 0.06666103440335676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 109.92857142857143, 103, 115, 110.5, 115.0, 115.0, 115.0, 0.11961007116799234, 0.08888990640511932, 0.06003864900424616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 268.6428571428571, 100, 873, 110.5, 863.5, 873.0, 873.0, 0.11961518087524137, 5.05203927863502, 0.06896896520052631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 318.00000000000006, 105, 1294, 111.0, 1243.5, 1294.0, 1294.0, 0.11941316956670078, 15.377327623891164, 0.06873587299556466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35475bf4-db39-41d7-980f-0ae26cb4128c", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 244.91666666666663, 111, 421, 220.0, 400.00000000000006, 421.0, 421.0, 0.05823207422648395, 0.13578480003348345, 0.03764138717292985], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 116.19999999999999, 101, 296, 106.5, 111.9, 286.79999999999984, 296.0, 0.103547002573143, 0.07695241109195491, 0.051975741525972174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 118.75, 98, 328, 107.0, 133.60000000000005, 318.39999999999986, 328.0, 0.10342812521008837, 0.035442313609589854, 0.05855203533621898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 751.75, 608, 811, 794.0, 811.0, 811.0, 811.0, 0.03517937081695294, 10.34390308523082, 0.020063234919043473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1262.5, 1139, 1553, 1179.0, 1553.0, 1553.0, 1553.0, 0.035076334873769044, 31.561747777037276, 0.01997021799942124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fde151e9-cdfa-4d39-b870-f4057466d15f", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 217.5, 105, 333, 216.0, 333.0, 333.0, 333.0, 0.03539729033742467, 0.062636611417396, 0.019599866817695107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 106.91666666666667, 102, 115, 105.5, 114.10000000000001, 115.0, 115.0, 0.0847595301496712, 0.06299023676162088, 0.04254531103215918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 157.91666666666669, 99, 319, 108.0, 316.6, 319.0, 319.0, 0.08475713549134418, 0.0332875924382509, 0.04774486424732133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 227.83333333333334, 99, 983, 107.0, 783.2000000000007, 983.0, 983.0, 0.0847565368479044, 6.376280894199121, 0.04922059301323615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 237.16666666666666, 103, 906, 114.5, 757.5000000000005, 906.0, 906.0, 0.0847565368479044, 2.097710491976381, 0.04930336306875168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 162.25, 103, 327, 109.5, 327.0, 327.0, 327.0, 0.035327574938618336, 0.026254184109656794, 0.01983726131807182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 788.5882352941177, 105, 1447, 1096.0, 1436.6, 1447.0, 1447.0, 0.0925850284562808, 49.015082084116216, 0.0497495609018871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 190.04999999999998, 101, 1297, 108.5, 324.9, 1248.3999999999992, 1297.0, 0.10343026472976256, 4.6798205048560515, 0.06036125605713488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 553.8235294117648, 102, 992, 801.0, 908.8, 992.0, 992.0, 0.09258906250851003, 16.024545632791778, 0.04984214756245677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 167.5, 103, 836, 107.5, 334.5, 810.9499999999996, 836.0, 0.10354646647683148, 1.5488185186383638, 0.06053019026663215], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 797.25, 112, 3216, 552.5, 2547.9000000000024, 3216.0, 3216.0, 0.05992150283129101, 0.011396203785540942, 0.04095708840169378], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 386.4166666666667, 215, 1091, 321.0, 918.5000000000007, 1091.0, 1091.0, 0.08469312856416915, 8.563855145195783, 0.18867103689091527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 440.70000000000005, 130, 1417, 313.0, 828.3000000000002, 1387.9999999999995, 1417.0, 0.08444198624440044, 0.05186914975364051, 0.03818031213980216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 108.05882352941178, 101, 114, 107.0, 114.0, 114.0, 114.0, 0.09258704543845411, 0.06880736482291366, 0.04647435679234904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc4e4ef1-8c83-4e3e-9a10-29b062a3dc51", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 143.52941176470588, 101, 323, 108.0, 315.0, 323.0, 323.0, 0.09258401999814833, 0.10657161033564432, 0.04822793504958692], "isController": false}, {"data": ["login", 20, 0, 0.0, 2163.4500000000003, 1211, 3299, 2014.5, 3283.6, 3298.4, 3299.0, 0.0858277008904624, 20.65502293208883, 0.1579598487286772], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a7e2212-2e04-4138-9f74-83219b8c5bb9", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.5827298129562043, 1.0888315465328466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 113.6, 109, 118, 113.0, 116.9, 117.95, 118.0, 0.10643902906317688, 0.08616987802087268, 0.03783574861230116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c2f996d-94ec-49d3-9d22-6aa99811ecc0", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 898.7058823529413, 214, 1552, 1210.0, 1545.6, 1552.0, 1552.0, 0.09253110678089722, 65.17632725156759, 0.19417818599568912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d447942-c5ec-4698-9ee7-b6a5a218e162", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7aaeab5-064e-417e-96b5-30717776d7fa", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 467.0000000000001, 220, 1402, 339.5, 1354.0, 1402.0, 1402.0, 0.11928497179762453, 20.545072412368146, 0.26391467183852224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 1162.6, 111, 1657, 1286.0, 1657.0, 1657.0, 1657.0, 0.04371966947929874, 41.845478976303944, 0.08451046266340227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=126c460f-ec78-40ed-b915-a0f0725b30c0", 1, 0, 0.0, 3216.0, 3216, 3216, 3216.0, 3216.0, 3216.0, 3216.0, 0.31094527363184077, 0.056176636349502485, 0.2143821906094527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5af01052-1acc-4e42-b476-4937ad535a16", 3, 0, 0.0, 359.33333333333337, 210, 644, 224.0, 644.0, 644.0, 644.0, 0.02101370093300832, 0.028969083154716874, 0.013475582955086716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37d4d581-6350-4280-91e1-b995f9084e1a", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.18267347067745196, 0.6971214610717897], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 825.9047619047619, 310, 1766, 838.0, 1306.4, 1723.1999999999994, 1766.0, 0.08307422088248559, 0.026238844318910066, 0.03748075199971517], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 123.0, 106, 330, 113.0, 126.00000000000001, 309.89999999999975, 330.0, 0.09383755378902638, 0.07285239771706638, 0.033356317948442966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 331.8499999999999, 210, 1594, 220.5, 443.5, 1536.499999999999, 1594.0, 0.10337092589338323, 6.335572754072814, 0.23116121406568188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c21b4e5e-3d8d-4386-b51a-2630af424ddc", 3, 0, 0.0, 352.3333333333333, 215, 491, 351.0, 491.0, 491.0, 491.0, 0.01849317601804934, 0.02549433607956997, 0.011859230714699609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/baa3ea85-4777-4f69-8862-1345e5b16f4e", 3, 0, 0.0, 327.3333333333333, 212, 534, 236.0, 534.0, 534.0, 534.0, 0.017836757990867577, 0.02457779836436929, 0.011438285560549847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 378.4117647058824, 215, 758, 424.0, 656.3999999999999, 758.0, 758.0, 0.12645234234368258, 0.19597643290959402, 0.28439428165771585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 108.87499999999999, 102, 115, 109.0, 115.0, 115.0, 115.0, 0.05879110784493845, 0.04369143854492009, 0.029510380304978875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 187.75000000000003, 102, 324, 112.0, 324.0, 324.0, 324.0, 0.058698363783109546, 0.026726671986205885, 0.03286019242057378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 207.50000000000003, 100, 916, 107.0, 916.0, 916.0, 916.0, 0.05878937969855746, 6.62621327730583, 0.03393019863461665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08991a52-fb1d-42c5-bd9c-0679d0ac1c1a", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 260.25, 103, 888, 109.0, 888.0, 888.0, 888.0, 0.058790675798818304, 2.174666523670596, 0.033988359446191836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 2.6332310267857144, 5.519321986607142], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1213.8035714285716, 820, 1832, 1132.5, 1663.0000000000002, 1777.75, 1832.0, 0.24185572442267744, 289.343529063716, 0.4775705808424353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 825.9047619047619, 310, 1766, 838.0, 1306.4, 1723.1999999999994, 1766.0, 0.08266089352489668, 0.026108295611100178, 0.03729427032080299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 135.5, 101, 308, 109.0, 308.0, 308.0, 308.0, 0.03912535273950829, 0.010545505230570594, 0.023039636427659667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 134.875, 102, 309, 109.5, 309.0, 309.0, 309.0, 0.03916346831675414, 0.010555778569750138, 0.023023835865904285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 181.14285714285714, 100, 1212, 108.0, 329.4, 1123.7999999999988, 1212.0, 0.09422491037416264, 4.061508149613453, 0.055008348439231664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 155.76190476190476, 104, 662, 111.0, 325.2, 628.5999999999995, 662.0, 0.09422660151570218, 1.3435090350971657, 0.0551013538904369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 120.85714285714286, 105, 333, 110.0, 116.4, 311.3999999999997, 333.0, 0.09422279653260109, 0.07002299625127874, 0.04729542716577828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 139.75, 101, 338, 110.5, 338.0, 338.0, 338.0, 0.0391628931587321, 0.010479133520988863, 0.0223350875045894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 177.23809523809524, 104, 328, 110.0, 320.0, 327.2, 328.0, 0.09422491037416264, 0.03195163906475046, 0.053360814664088194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 135.75, 105, 318, 111.0, 318.0, 318.0, 318.0, 0.0391640434916703, 0.029105309665196383, 0.019658514018279817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 142.00000000000003, 107, 339, 114.5, 339.0, 339.0, 339.0, 0.040176979595116485, 0.031623677298499894, 0.014281660715451564], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 760.8181818181819, 447, 1785, 644.0, 1636.0000000000005, 1785.0, 1785.0, 0.05678357199640715, 0.010258750800132152, 0.03865053679833573], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1129.85, 830, 1842, 1100.0, 1507.3000000000002, 1825.5499999999997, 1842.0, 0.08560324607509118, 0.0443063675974593, 0.03937414931774213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 302.625, 216, 657, 221.5, 657.0, 657.0, 657.0, 0.039104889088758324, 0.06060494041392525, 0.08794781208145548], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1185.7049180327865, 560, 3063, 928.0, 2021.8000000000002, 2183.5, 3063.0, 0.2885593320561035, 91.62057219600747, 1.0498849532273704], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fde151e9-cdfa-4d39-b870-f4057466d15f", 3, 0, 0.0, 562.0, 241, 726, 719.0, 726.0, 726.0, 726.0, 0.024471617002879493, 0.024543311193317617, 0.015693061684789258], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 201.62500000000003, 101, 461, 113.0, 434.90000000000003, 443.45, 461.0, 0.24288267032147257, 0.18050167198695374, 0.11740910332922747], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 703.6071428571427, 490, 1125, 645.0, 900.3000000000003, 954.8, 1125.0, 0.2424840761573202, 71.29836961934329, 0.12195244064552724], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 156.67857142857144, 103, 541, 112.0, 323.20000000000005, 343.0999999999999, 541.0, 0.24304078745215135, 0.4300682684211897, 0.1181975704601283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5212c90a-74d1-4a34-8a73-3b37caa85b0a", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1006.7142857142853, 708, 1353, 977.0, 1317.4, 1339.1, 1353.0, 0.24235709586954265, 218.07334088174704, 0.12165190163764153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 123.52941176470588, 107, 315, 111.0, 157.39999999999986, 315.0, 315.0, 0.12011078453538322, 0.08973120133746891, 0.04269563044031201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 196.81460674157307, 103, 2374, 114.0, 336.0, 418.2999999999999, 1810.7300000000057, 0.7333825001751054, 1.520845682983054, 0.35466884999031767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 139.12500000000003, 108, 332, 112.0, 332.0, 332.0, 332.0, 0.057865765889577654, 0.04481206284222176, 0.020569471468560804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 127.00000000000001, 103, 312, 113.0, 217.0, 312.0, 312.0, 0.1181873438238671, 0.09591179952893901, 0.04201190737489025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9473881f-1f7b-40ac-bb85-1723dadaf1df", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d447942-c5ec-4698-9ee7-b6a5a218e162", 3, 0, 0.0, 351.33333333333337, 214, 618, 222.0, 618.0, 618.0, 618.0, 0.04257795313586625, 0.027373521303169217, 0.027304221249237145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 427.375, 208, 1020, 435.0, 1020.0, 1020.0, 1020.0, 0.05865145638897646, 8.850477562610429, 0.13003268444050176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35475bf4-db39-41d7-980f-0ae26cb4128c", 3, 0, 0.0, 325.6666666666667, 207, 447, 323.0, 447.0, 447.0, 447.0, 0.06491539360366988, 0.02937252510061886, 0.04162868665339508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 354.09523809523813, 214, 1325, 224.0, 619.4000000000001, 1258.799999999999, 1325.0, 0.09417673834562863, 5.50415386685203, 0.21065826316792607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c2f996d-94ec-49d3-9d22-6aa99811ecc0", 3, 0, 0.0, 806.3333333333333, 218, 1785, 416.0, 1785.0, 1785.0, 1785.0, 0.08112054513006328, 0.03670493415715754, 0.05202066207884917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 111.08333333333334, 104, 116, 112.0, 116.0, 116.0, 116.0, 0.09112586000030375, 0.07555259291040808, 0.03239239554698297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37d4d581-6350-4280-91e1-b995f9084e1a", 3, 0, 0.0, 490.6666666666667, 212, 1040, 220.0, 1040.0, 1040.0, 1040.0, 0.04437541601952519, 0.028529116744323645, 0.028456891132312697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1884b12e-95d5-4ef3-b98a-8166c106fd76", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 135.29411764705884, 106, 341, 113.0, 260.99999999999994, 341.0, 341.0, 0.09164222873900293, 0.07114801938233138, 0.03257594849706745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7aaeab5-064e-417e-96b5-30717776d7fa", 3, 0, 0.0, 374.6666666666667, 218, 583, 323.0, 583.0, 583.0, 583.0, 0.020473203988180137, 0.024198634010768907, 0.013128975213774373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 142.9411764705882, 107, 439, 111.0, 333.3999999999999, 439.0, 439.0, 0.12676255881409898, 0.09420537818118098, 0.06362886252973328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 169.52941176470588, 104, 335, 110.0, 325.4, 335.0, 335.0, 0.12676633980835914, 0.0339198995190336, 0.07229642817195482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 191.64705882352942, 99, 329, 111.0, 324.2, 329.0, 329.0, 0.12656154613540596, 0.03411229173180864, 0.07440434645851014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5af01052-1acc-4e42-b476-4937ad535a16", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/126c460f-ec78-40ed-b915-a0f0725b30c0", 3, 0, 0.0, 821.0, 421, 1341, 701.0, 1341.0, 1341.0, 1341.0, 0.016956816640289397, 0.023376340648315626, 0.010874000254352251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 183.7058823529412, 104, 332, 110.0, 324.8, 332.0, 332.0, 0.12676823039007332, 0.034167999597324444, 0.07464965129415449], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3834355828220859], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07668711656441718], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5368098159509203], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 13, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
