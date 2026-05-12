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

    var data = {"OkPercent": 97.66355140186916, "KoPercent": 2.336448598130841};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7784511784511785, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=430e159e-59dc-48fd-9dda-17dfb5f1f43b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/618feb30-6d1b-4518-b17e-d9d491037d79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e0d68f1-5e4b-4c3e-9dc5-a34519b6ec99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fc916adb-f0db-427e-9349-1df725132fd5"], "isController": false}, {"data": [0.04716981132075472, 500, 1500, "see books"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3867924528301887, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=644663c8-065b-4e01-b119-bf160aa17bc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/644663c8-065b-4e01-b119-bf160aa17bc6"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.2890625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83347862-4949-464e-bca9-faa95119a25b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9517a3ea-765d-490a-b5f4-862919eeb929"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61a35b88-aed0-4f3e-9ff6-0ab269b5d86b"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.919889502762431, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61a35b88-aed0-4f3e-9ff6-0ab269b5d86b"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/342e8a1f-0531-400c-be67-67495f92ea04"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9517a3ea-765d-490a-b5f4-862919eeb929"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7be8bdfc-2cc0-4ebf-8af5-ae79d25deb7e"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "login"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=342e8a1f-0531-400c-be67-67495f92ea04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c65ab65-ff13-4ce2-89e9-d2bb7074a734"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83347862-4949-464e-bca9-faa95119a25b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff4e4e92-5dc3-4414-b47e-f6f4517b1bc8"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f19cbce7-e50b-4317-961b-66d25c7ac021"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/034c1a22-1463-4a95-9080-43bb9181b59b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e0d68f1-5e4b-4c3e-9dc5-a34519b6ec99"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/430e159e-59dc-48fd-9dda-17dfb5f1f43b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff4e4e92-5dc3-4414-b47e-f6f4517b1bc8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 30, 2.336448598130841, 358.8753894080996, 107, 2277, 118.5, 1040.0, 1295.0, 1716.0000000000018, 4.944185383848224, 657.3427765172372, 3.6219101548812276], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=430e159e-59dc-48fd-9dda-17dfb5f1f43b", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/618feb30-6d1b-4518-b17e-d9d491037d79", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.730745852402746, 1.365399742562929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e0d68f1-5e4b-4c3e-9dc5-a34519b6ec99", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc916adb-f0db-427e-9349-1df725132fd5", 1, 0, 0.0, 968.0, 968, 968, 968.0, 968.0, 968.0, 968.0, 1.0330578512396695, 0.3298924974173554, 0.6164046358471075], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1811.8867924528304, 1316, 2344, 1767.0, 2189.8, 2261.2, 2344.0, 0.25269381138552494, 304.0753814618694, 1.2424934964122245], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 415.375, 221, 1350, 435.0, 864.2000000000005, 1350.0, 1350.0, 0.09658452957297566, 7.362123933420059, 0.21567636712383345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 142.5, 112, 344, 117.0, 337.7, 344.0, 344.0, 0.14346287499601493, 0.11137986877132017, 0.050996568846239675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 424.50000000000006, 219, 1198, 231.0, 1156.0, 1198.0, 1198.0, 0.07394432916318128, 11.158164970376054, 0.16393761062764872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 112.7, 109, 122, 110.5, 121.5, 122.0, 122.0, 0.05894731878120524, 0.04380752889892303, 0.02958879087259716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 131.6, 108, 326, 109.0, 304.9000000000001, 326.0, 326.0, 0.0588765182782151, 0.024597045429121504, 0.03308354357156735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 256.8, 108, 1360, 110.0, 1256.6000000000004, 1360.0, 1360.0, 0.05895253142169925, 5.3188597346104425, 0.034151017225929683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 241.5, 108, 860, 111.5, 818.9000000000001, 860.0, 860.0, 0.05895079377243814, 1.7476492449877086, 0.03420757974568627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 116.66666666666667, 115, 119, 116.0, 119.0, 119.0, 119.0, 0.02617732520091097, 0.007720265830737416, 0.016181881691578755], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1252.471698113207, 863, 1888, 1220.0, 1725.6000000000001, 1794.1999999999998, 1888.0, 0.24170231395762456, 289.1599968134058, 0.47726765509991886], "isController": false}, {"data": ["deleteBook", 12, 3, 25.0, 453.8333333333333, 112, 885, 474.5, 798.9000000000003, 885.0, 885.0, 0.07155251059871563, 0.014970825581811351, 0.04777737218932794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 3, 25.0, 453.8333333333333, 112, 885, 474.5, 798.9000000000003, 885.0, 885.0, 0.07079228364108313, 0.014811764423927792, 0.04726974994100643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1129.45, 123, 2097, 1064.5, 1868.5000000000002, 2086.0499999999997, 2097.0, 0.07705288139249968, 0.024304766298610735, 0.03476409297200669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 140.33333333333334, 108, 340, 110.0, 331.0, 340.0, 340.0, 0.10205192401894084, 0.027306862481630653, 0.058201487917052194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 168.83333333333331, 109, 465, 110.0, 465.0, 465.0, 465.0, 0.03787783136789475, 0.010209259235877882, 0.02230501202621146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 125.93333333333335, 108, 328, 111.0, 202.00000000000006, 328.0, 328.0, 0.10205261833001095, 0.0758418384268929, 0.05122563068518128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 109.33333333333334, 109, 110, 109.0, 110.0, 110.0, 110.0, 0.03787807049108918, 0.010209323687051382, 0.02226816253480048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 168.73333333333332, 108, 341, 111.0, 331.4, 341.0, 341.0, 0.10204984114241396, 0.02750562124541626, 0.0600938029383551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=644663c8-065b-4e01-b119-bf160aa17bc6", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 177.46666666666664, 108, 454, 113.0, 377.20000000000005, 454.0, 454.0, 0.10204775835090822, 0.027505059868018232, 0.0599929204367644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 177.55555555555554, 108, 861, 111.0, 393.9000000000007, 861.0, 861.0, 0.13364219529579474, 6.714657497791192, 0.07792894504335947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 231.94444444444449, 108, 989, 112.5, 403.10000000000093, 989.0, 989.0, 0.13351530975551865, 2.2149836397386067, 0.07798534205880607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 111.83333333333333, 109, 117, 111.0, 117.0, 117.0, 117.0, 0.037876157590066344, 0.010134831230154472, 0.021601246125584714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 137.33333333333331, 109, 332, 114.0, 325.7, 332.0, 332.0, 0.134390538906061, 0.09987421885499262, 0.06745775097433142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.16666666666666, 110, 116, 113.5, 116.0, 116.0, 116.0, 0.03787759224771945, 0.028149265332533695, 0.019012775796218552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 147.94444444444446, 107, 340, 112.5, 328.3, 340.0, 340.0, 0.13417515821487405, 0.047098159377725435, 0.07589573565257579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 116.33333333333333, 112, 121, 116.0, 121.0, 121.0, 121.0, 0.0402160944810113, 0.03165446499188976, 0.014295564835046987], "isController": false}, {"data": ["deleteAccount", 11, 3, 27.272727272727273, 400.27272727272725, 109, 703, 434.0, 689.8000000000001, 703.0, 703.0, 0.06527027828873197, 0.013339149557942206, 0.04440974900611167], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1297.5, 722, 2277, 1186.0, 1980.9000000000005, 2277.0, 2277.0, 0.09667076622323428, 0.05003467392413493, 0.044464776260882174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/644663c8-065b-4e01-b119-bf160aa17bc6", 3, 0, 0.0, 327.0, 217, 434, 330.0, 434.0, 434.0, 434.0, 0.023225027289407063, 0.032017575055546525, 0.014893653567751276], "isController": false}, {"data": ["goToProfile", 12, 3, 25.0, 219.41666666666666, 111, 344, 218.0, 332.90000000000003, 344.0, 344.0, 0.07141624362461242, 0.13979287987490255, 0.04615205001815163], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 284.8333333333333, 220, 576, 227.0, 576.0, 576.0, 576.0, 0.03784963601266701, 0.05865954331260015, 0.08512471849333215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 124.5, 108, 325, 112.0, 177.30000000000015, 325.0, 325.0, 0.09677790076636, 0.07192185789374997, 0.048577969720614296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 762.75, 650, 861, 770.0, 861.0, 861.0, 861.0, 0.025682512777050106, 7.551511496134783, 0.014647058068161389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 204.31249999999997, 107, 330, 112.5, 328.6, 330.0, 330.0, 0.09664987375110241, 0.034934115744264436, 0.054613313671124646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1228.5, 883, 1390, 1320.5, 1390.0, 1390.0, 1390.0, 0.025565966585281673, 23.004301673612087, 0.014555623553925015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 218.5, 110, 329, 217.5, 329.0, 329.0, 329.0, 0.025741516561448217, 0.04555041797787517, 0.01425335926791127], "isController": false}, {"data": ["addBook", 64, 13, 20.3125, 1044.96875, 569, 2215, 886.0, 1889.5, 2093.5, 2215.0, 0.3013182674199623, 79.97672617996705, 1.098596030484934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83347862-4949-464e-bca9-faa95119a25b", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 133.35714285714286, 109, 347, 113.0, 256.0, 347.0, 347.0, 0.07818128005092953, 0.05810151769409899, 0.03924333783806423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 127.35714285714286, 109, 322, 113.0, 219.0, 322.0, 322.0, 0.07817822401411675, 0.029305927445023954, 0.04411703629144842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 221.00000000000003, 108, 1231, 110.0, 779.5, 1231.0, 1231.0, 0.07818084345961401, 5.044371337018071, 0.045481880193441744], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 195.71698113207543, 109, 463, 113.0, 444.4, 453.9, 463.0, 0.2425440583570157, 0.18025002774383686, 0.11724541883469021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 202.0, 108, 641, 110.0, 540.0, 641.0, 641.0, 0.07818084345961401, 1.661550155105209, 0.04555822867338277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9517a3ea-765d-490a-b5f4-862919eeb929", 3, 0, 0.0, 291.3333333333333, 214, 441, 219.0, 441.0, 441.0, 441.0, 0.01844247178301817, 0.021798377293013992, 0.011826715303563086], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 719.8679245283018, 533, 1026, 661.0, 895.8, 1015.0, 1026.0, 0.2424774793322262, 71.29642993373045, 0.12194912290634422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 169.0, 109, 343, 112.0, 343.0, 343.0, 343.0, 0.02577635148632887, 0.019156058087008074, 0.01447402549281162], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 176.62264150943392, 108, 453, 114.0, 332.2, 338.29999999999995, 453.0, 0.24272845098030235, 0.4295155792737382, 0.11804567244940485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 529.0909090909092, 108, 1298, 112.5, 1288.5, 1296.8, 1298.0, 0.09702186961142742, 31.762258933729655, 0.054006314139173464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 208.75000000000003, 109, 1240, 111.0, 605.8000000000006, 1240.0, 1240.0, 0.09665279296367668, 5.459944826734767, 0.05630213965120424], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1052.8679245283017, 748, 1442, 1073.0, 1324.8, 1381.2, 1442.0, 0.24224363310602043, 217.9712468876835, 0.12159494864892041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 376.45454545454555, 109, 1095, 115.0, 878.5, 1063.1999999999996, 1095.0, 0.09702015814285776, 10.390149201568198, 0.054100107714425576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 130.37499999999997, 111, 338, 116.5, 187.50000000000017, 338.0, 338.0, 0.07526401204224192, 0.056227508996401436, 0.026754004280640682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 151.1875, 108, 544, 110.5, 390.70000000000016, 544.0, 544.0, 0.09677907152578255, 1.80297094737638, 0.056470210192045976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61a35b88-aed0-4f3e-9ff6-0ab269b5d86b", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["deleteBooks", 11, 3, 27.272727272727273, 394.3636363636364, 115, 853, 427.0, 799.6000000000001, 853.0, 853.0, 0.06622197606376574, 0.01402748889276856, 0.04436942945252486], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 13, 7.18232044198895, 164.7292817679558, 109, 631, 117.0, 285.00000000000006, 339.1, 587.5400000000004, 0.7462317358751938, 1.470597187664913, 0.3634046771413965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 160.2, 111, 343, 117.5, 342.4, 343.0, 343.0, 0.06034638826866212, 0.04673309169633697, 0.021451255204875987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61a35b88-aed0-4f3e-9ff6-0ab269b5d86b", 3, 0, 0.0, 338.0, 301, 408, 305.0, 408.0, 408.0, 408.0, 0.023668639053254437, 0.02839158037475345, 0.015178131163708086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 380.2142857142857, 220, 1339, 228.5, 1005.0, 1339.0, 1339.0, 0.07813066796140344, 6.788969719831796, 0.17428981315608832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 134.4, 110, 337, 118.0, 237.40000000000006, 337.0, 337.0, 0.09753116120600532, 0.07914882320526408, 0.0346692799599472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/342e8a1f-0531-400c-be67-67495f92ea04", 3, 0, 0.0, 324.6666666666667, 194, 565, 215.0, 565.0, 565.0, 565.0, 0.10554461018857304, 0.047756187552772306, 0.06768322984097945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9517a3ea-765d-490a-b5f4-862919eeb929", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7be8bdfc-2cc0-4ebf-8af5-ae79d25deb7e", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 571.0, 121, 1464, 515.0, 1285.8000000000002, 1464.0, 1464.0, 0.09704864293647628, 0.059612887116253496, 0.04388039226522316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 112.27272727272727, 109, 119, 112.0, 115.7, 118.55, 119.0, 0.09702015814285776, 0.07210189486983863, 0.04869957156780166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 140.90909090909088, 108, 348, 110.0, 326.4, 344.84999999999997, 348.0, 0.09702229748800452, 0.07895120550204629, 0.052369990121366075], "isController": false}, {"data": ["login", 18, 0, 0.0, 2451.333333333333, 1297, 3914, 2379.5, 3221.900000000001, 3914.0, 3914.0, 0.09298721425803952, 24.849460803306215, 0.17456291166214646], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 427.3, 220, 1471, 235.5, 1380.3000000000002, 1471.0, 1471.0, 0.05883391186680002, 7.120644222142142, 0.13081352591633819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 128.62500000000003, 109, 330, 113.5, 194.20000000000013, 330.0, 330.0, 0.09028784894842871, 0.07309436208813222, 0.03209450880588677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=342e8a1f-0531-400c-be67-67495f92ea04", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c65ab65-ff13-4ce2-89e9-d2bb7074a734", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.7208486173814899, 1.346906743792325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 384.2777777777777, 223, 1100, 232.5, 703.1000000000006, 1100.0, 1100.0, 0.1334054711065984, 9.061895216950647, 0.29813575118397356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83347862-4949-464e-bca9-faa95119a25b", 3, 0, 0.0, 444.0, 307, 703, 322.0, 703.0, 703.0, 703.0, 0.06158646740022992, 0.027866272684348825, 0.03949392603465265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 117.0, 111, 136, 116.0, 129.0, 136.0, 136.0, 0.08064934241982591, 0.0668664958148752, 0.028668320938297492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff4e4e92-5dc3-4414-b47e-f6f4517b1bc8", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 652.8181818181818, 220, 1411, 229.0, 1404.7, 1410.55, 1411.0, 0.09697097923057936, 42.281456132202294, 0.2090678471781445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f19cbce7-e50b-4317-961b-66d25c7ac021", 2, 0, 0.0, 268.5, 193, 344, 268.5, 344.0, 344.0, 344.0, 0.010819993183404293, 0.02139695917616572, 0.006725513341051596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 146.50000000000003, 111, 547, 115.0, 272.4999999999999, 514.5999999999996, 547.0, 0.09802086953422265, 0.07610018679658886, 0.03484335596724321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/034c1a22-1463-4a95-9080-43bb9181b59b", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e0d68f1-5e4b-4c3e-9dc5-a34519b6ec99", 3, 0, 0.0, 320.0, 260, 414, 286.0, 414.0, 414.0, 414.0, 0.04007587699377488, 0.03340960969435464, 0.025699699764888187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 626.9000000000001, 109, 1733, 114.5, 1703.1000000000001, 1733.0, 1733.0, 0.04488652686009768, 21.4871628741292, 0.05833056766868357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 320.2, 219, 653, 227.0, 602.6, 653.0, 653.0, 0.10197214121102115, 0.15803690244325252, 0.2293377355556462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 125.74999999999999, 108, 334, 112.0, 181.40000000000015, 334.0, 334.0, 0.07398193915910278, 0.054980718457106656, 0.03713546555447152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 165.24999999999997, 108, 339, 110.0, 335.5, 339.0, 339.0, 0.07398364961343543, 0.03368640296119557, 0.041417116348536974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/430e159e-59dc-48fd-9dda-17dfb5f1f43b", 3, 0, 0.0, 312.3333333333333, 226, 466, 245.0, 466.0, 466.0, 466.0, 0.026443833298074888, 0.026521305465940344, 0.01695779674388266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 269.5, 108, 1084, 114.5, 1040.6000000000001, 1084.0, 1084.0, 0.07398330751624164, 8.338736980671861, 0.04269935033408088], "isController": false}, {"data": ["register", 20, 5, 25.0, 1129.45, 123, 2097, 1064.5, 1868.5000000000002, 2086.0499999999997, 2097.0, 0.07888923950773115, 0.02488400816503629, 0.03559260610602714], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff4e4e92-5dc3-4414-b47e-f6f4517b1bc8", 3, 0, 0.0, 386.3333333333333, 206, 637, 316.0, 637.0, 637.0, 637.0, 0.02126272219544694, 0.025131817803277293, 0.01363527432455419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 247.5625, 108, 872, 113.5, 867.1, 872.0, 872.0, 0.07398296542221153, 2.736629168477708, 0.042771401884716044], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 16.666666666666668, 0.3894080996884735], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2336448598130841], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.2336448598130841], "isController": false}, {"data": ["401/Unauthorized", 19, 63.333333333333336, 1.4797507788161994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 30, "401/Unauthorized", 19, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
