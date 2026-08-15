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

    var data = {"OkPercent": 98.69029275808937, "KoPercent": 1.3097072419106317};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7306675479180437, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e290d1a5-820b-43ec-b69b-b638341c3b9e"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc616020-69b1-494d-acc4-20be7396798b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1232c49-12ec-4266-93f8-79b6a7269dc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecc3142b-d6a3-413f-b9a0-4cc14a0bdb62"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93b0fbb7-a14e-45db-adc5-ce066f2c6f1a"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccd1288e-52f4-48c1-a24a-17f4734655ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0a0ceba-547e-4805-9486-72b572100e86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9214f80-3189-43a1-bd80-ebb9a42e7f63"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87c87aa4-8bd4-4ddb-b901-0bcb72583977"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09eb2465-26ef-4d04-a5d6-53a3268dc117"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/78ebb89b-d640-4de5-bcc3-6c8b1eaa7e39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2a05eb08-9536-421e-a38f-1e605f89c5e2"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e290d1a5-820b-43ec-b69b-b638341c3b9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4ca0cf5-72d1-4ab2-9134-c7635e505a21"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8f41de1-6f7e-48d3-90c0-3016b90aa9de"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec475c88-3af7-45c4-9b5a-2f3611fc919b"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93b0fbb7-a14e-45db-adc5-ce066f2c6f1a"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0a0ceba-547e-4805-9486-72b572100e86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1232c49-12ec-4266-93f8-79b6a7269dc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87c87aa4-8bd4-4ddb-b901-0bcb72583977"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09eb2465-26ef-4d04-a5d6-53a3268dc117"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9497041420118343, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a26a33cc-1a6d-429c-bdff-2d2d3adc9e73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9214f80-3189-43a1-bd80-ebb9a42e7f63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8f41de1-6f7e-48d3-90c0-3016b90aa9de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4ca0cf5-72d1-4ab2-9134-c7635e505a21"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccd1288e-52f4-48c1-a24a-17f4734655ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a05eb08-9536-421e-a38f-1e605f89c5e2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecc3142b-d6a3-413f-b9a0-4cc14a0bdb62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b2a6ea8c-a553-410b-83c0-e9e5337531c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec475c88-3af7-45c4-9b5a-2f3611fc919b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 17, 1.3097072419106317, 490.86363636363615, 136, 2686, 163.0, 1394.4000000000005, 1665.1999999999998, 2145.14, 5.166128030821645, 746.1365784837036, 3.7711570144217754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e290d1a5-820b-43ec-b69b-b638341c3b9e", 3, 0, 0.0, 440.0, 231, 622, 467.0, 622.0, 622.0, 622.0, 0.033084829502845296, 0.027581461053641537, 0.02121650850280118], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2347.368421052632, 1731, 3286, 2280.0, 2807.2000000000003, 3155.2, 3286.0, 0.2628351147713334, 316.2795516586279, 1.2923582059313123], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 607.8571428571429, 146, 1510, 534.5, 1118.5, 1510.0, 1510.0, 0.075808032402519, 0.014314477100559355, 0.051266662537836336], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 607.8571428571429, 146, 1510, 534.5, 1118.5, 1510.0, 1510.0, 0.07521826729348556, 0.014203114506380121, 0.05086782236400269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc616020-69b1-494d-acc4-20be7396798b", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 231.28571428571428, 139, 439, 145.5, 437.5, 439.0, 439.0, 0.0650167882635409, 0.031347380055635796, 0.0362998307241477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1232c49-12ec-4266-93f8-79b6a7269dc5", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 186.14285714285714, 139, 431, 146.0, 426.5, 431.0, 431.0, 0.06502947228583239, 0.04832756680617037, 0.03264174683097447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 272.42857142857144, 140, 1145, 144.0, 1021.5, 1145.0, 1145.0, 0.0650167882635409, 2.7460341210426833, 0.03748805606769176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecc3142b-d6a3-413f-b9a0-4cc14a0bdb62", 3, 0, 0.0, 357.0, 235, 583, 253.0, 583.0, 583.0, 583.0, 0.050055895750254445, 0.032181117873291844, 0.0320996466888025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 417.92857142857144, 141, 1571, 163.0, 1498.0, 1571.0, 1571.0, 0.0650225256606753, 8.373219500371556, 0.037427865635595185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93b0fbb7-a14e-45db-adc5-ce066f2c6f1a", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 259.99999999999994, 139, 363, 256.0, 345.0, 363.0, 363.0, 0.07385124390111811, 0.13172542507545137, 0.04773405920900395], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 144.94117647058826, 137, 166, 144.0, 157.2, 166.0, 166.0, 0.0761041821486449, 0.05655789317882692, 0.038200732055081524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 208.88235294117646, 136, 438, 144.0, 429.2, 438.0, 438.0, 0.0761041821486449, 0.027087632846565016, 0.04302719213619963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1075.6, 822, 1288, 1157.0, 1288.0, 1288.0, 1288.0, 0.04997201567122411, 14.693431834422723, 0.028499665187495003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1559.0, 1291, 1737, 1578.0, 1737.0, 1737.0, 1737.0, 0.049971016810250055, 44.96400876554098, 0.028450295703491973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 316.6, 144, 439, 420.0, 439.0, 439.0, 439.0, 0.05040932370851312, 0.08920087359357987, 0.02791219388938178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 201.2, 139, 436, 145.0, 433.0, 436.0, 436.0, 0.0818437765992274, 0.06082335350782426, 0.04108173942578406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 179.4666666666667, 140, 429, 143.0, 417.6, 429.0, 429.0, 0.08184333004141273, 0.021899484796237392, 0.0466762741642432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 237.00000000000003, 138, 433, 144.0, 431.2, 433.0, 433.0, 0.08172249220912241, 0.022026765478240024, 0.0480438870213786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 253.13333333333335, 139, 432, 145.0, 424.2, 432.0, 432.0, 0.08172204697383259, 0.022026645473415818, 0.04812343195822369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccd1288e-52f4-48c1-a24a-17f4734655ef", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 256.4, 141, 434, 146.0, 434.0, 434.0, 434.0, 0.050411356670430715, 0.03746390861933376, 0.02830715828661881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0a0ceba-547e-4805-9486-72b572100e86", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9214f80-3189-43a1-bd80-ebb9a42e7f63", 3, 0, 0.0, 389.6666666666667, 323, 493, 353.0, 493.0, 493.0, 493.0, 0.017018186768927062, 0.023460944325001985, 0.010913355447521584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 209.4705882352941, 137, 979, 144.0, 542.1999999999996, 979.0, 979.0, 0.07610520425293789, 4.047517662283156, 0.04435681309457191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 987.7894736842105, 138, 2000, 1273.0, 1915.0, 2000.0, 2000.0, 0.12077832092706897, 57.21360192339476, 0.06554160733696517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 249.70588235294116, 137, 1110, 145.0, 565.9999999999995, 1110.0, 1110.0, 0.07610316007180556, 1.3355912236268976, 0.04442994116554228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 680.4210526315788, 139, 1262, 848.0, 1256.0, 1262.0, 1262.0, 0.1209952175048239, 18.739980083550382, 0.06577746790442651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87c87aa4-8bd4-4ddb-b901-0bcb72583977", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.21254595588235295, 0.8111213235294118], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 468.1428571428571, 158, 850, 531.0, 766.0, 850.0, 850.0, 0.07524292716484651, 0.014207770914846506, 0.051493328572426694], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 478.1333333333334, 286, 866, 294.0, 863.6, 866.0, 866.0, 0.08165665011758558, 0.12655185911778155, 0.1836477199421871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 804.4545454545455, 179, 1469, 811.0, 1424.5, 1464.35, 1469.0, 0.09954390791283574, 0.061145623122239916, 0.04500862242543256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 174.94736842105266, 140, 420, 144.0, 420.0, 420.0, 420.0, 0.12098751281512471, 0.0899135715354589, 0.0607300601435294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 218.4736842105263, 138, 439, 143.0, 435.0, 439.0, 439.0, 0.1207737145545039, 0.1277882240860926, 0.0635402828011874], "isController": false}, {"data": ["login", 22, 0, 0.0, 3168.818181818182, 2039, 4640, 2976.5, 4493.599999999999, 4627.849999999999, 4640.0, 0.10092020881308661, 27.579049803262933, 0.19030053579456316], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09eb2465-26ef-4d04-a5d6-53a3268dc117", 3, 0, 0.0, 310.6666666666667, 233, 443, 256.0, 443.0, 443.0, 443.0, 0.03663808895727999, 0.030543667258982436, 0.02349512866075572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 149.11764705882354, 142, 157, 150.0, 155.4, 157.0, 157.0, 0.07988759345673617, 0.06467462399964286, 0.028397542986574185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78ebb89b-d640-4de5-bcc3-6c8b1eaa7e39", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.5733140709156194, 1.0712382181328546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a05eb08-9536-421e-a38f-1e605f89c5e2", 3, 0, 0.0, 998.6666666666666, 363, 1869, 764.0, 1869.0, 1869.0, 1869.0, 0.10130685847431871, 0.04583871526018978, 0.06496566119609631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1180.736842105263, 284, 2145, 1418.0, 2064.0, 2145.0, 2145.0, 0.1206594355678614, 76.06259560474192, 0.2551175576148805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e290d1a5-820b-43ec-b69b-b638341c3b9e", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4ca0cf5-72d1-4ab2-9134-c7635e505a21", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8f41de1-6f7e-48d3-90c0-3016b90aa9de", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 628.8571428571429, 288, 2002, 451.0, 1790.0, 2002.0, 2002.0, 0.06496911646642257, 11.18996955152747, 0.14374235742759425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 1190.875, 139, 2048, 1578.0, 2048.0, 2048.0, 2048.0, 0.07143112254009072, 53.41745254852852, 0.11826419860977179], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1282.2608695652173, 267, 2479, 1405.0, 2221.8000000000006, 2456.2, 2479.0, 0.09522350612949569, 0.029999932722522844, 0.04296216780451856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ec475c88-3af7-45c4-9b5a-2f3611fc919b", 3, 0, 0.0, 324.3333333333333, 251, 461, 261.0, 461.0, 461.0, 461.0, 0.06207709975789931, 0.027482049371986676, 0.039808556810892466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 448.05882352941177, 280, 1277, 298.0, 719.3999999999995, 1277.0, 1277.0, 0.07605243144096989, 5.463000631906231, 0.1698990697557375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 168.53333333333333, 145, 441, 148.0, 270.0000000000001, 441.0, 441.0, 0.09660777885835367, 0.075003109562882, 0.03434104639105541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93b0fbb7-a14e-45db-adc5-ce066f2c6f1a", 3, 0, 0.0, 348.0, 236, 482, 326.0, 482.0, 482.0, 482.0, 0.0761982169617231, 0.03532104848746539, 0.048864090955271645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 658.7692307692307, 286, 1813, 574.0, 1714.6, 1813.0, 1813.0, 0.1177013825385472, 21.81770015176688, 0.2600800906979692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0a0ceba-547e-4805-9486-72b572100e86", 3, 0, 0.0, 461.0, 333, 527, 523.0, 527.0, 527.0, 527.0, 0.03232793456826043, 0.026950468889750966, 0.02073112991519305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 147.85714285714286, 140, 185, 144.0, 170.5, 185.0, 185.0, 0.0633813975598162, 0.04710277689748059, 0.031814490572017115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 143.28571428571428, 138, 154, 143.0, 151.0, 154.0, 154.0, 0.06338024980872746, 0.0169591684058509, 0.03614654871903988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 182.64285714285717, 139, 422, 142.5, 420.5, 422.0, 422.0, 0.06338053674260259, 0.017083035293904602, 0.0372608233584441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 182.2857142857143, 139, 417, 143.0, 416.5, 417.0, 417.0, 0.06330344506391386, 0.017062256677383036, 0.037277321653847714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 1.8665941455696202, 3.9124307753164556], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1625.2807017543857, 1111, 2686, 1435.0, 2216.6, 2561.9999999999995, 2686.0, 0.2548021260331779, 304.8319262873095, 0.5031346668350447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1282.2608695652173, 267, 2479, 1405.0, 2221.8000000000006, 2456.2, 2479.0, 0.09927700442430129, 0.031276977446854426, 0.044790992230495305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 144.0, 140, 149, 144.0, 149.0, 149.0, 149.0, 0.04447079750963533, 0.011986269641268902, 0.02618739345538097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 142.83333333333334, 139, 147, 143.0, 147.0, 147.0, 147.0, 0.04447013830213012, 0.011986091964246008, 0.026143577400275717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 239.26666666666665, 139, 1289, 144.0, 769.4000000000003, 1289.0, 1289.0, 0.09024944947835818, 5.4364775959502065, 0.05253975112210149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 230.66666666666666, 140, 1167, 145.0, 718.2000000000003, 1167.0, 1167.0, 0.09024836349634194, 1.791770796983298, 0.052627252072704085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 145.53333333333333, 139, 153, 146.0, 150.6, 153.0, 153.0, 0.09024130525023914, 0.0670640950150703, 0.04529690517443644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 193.16666666666666, 142, 439, 144.5, 439.0, 439.0, 439.0, 0.044372790604801135, 0.011873188111050304, 0.02530635714180065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 144.06666666666663, 138, 153, 144.0, 150.6, 153.0, 153.0, 0.09024782051513457, 0.03318487566858594, 0.05096416635079929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1232c49-12ec-4266-93f8-79b6a7269dc5", 3, 0, 0.0, 344.6666666666667, 247, 484, 303.0, 484.0, 484.0, 484.0, 0.02144480821193189, 0.025347037310392152, 0.013752041724448511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 143.83333333333334, 141, 148, 142.5, 148.0, 148.0, 148.0, 0.04447079750963533, 0.033049098539875484, 0.022322255781203677], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 535.5, 144, 814, 495.5, 789.0, 814.0, 814.0, 0.07396566936289142, 0.013822128084764658, 0.050340613558435526], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 198.83333333333334, 147, 451, 148.5, 451.0, 451.0, 451.0, 0.04353157127206507, 0.03426410785672309, 0.01547411322561688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1596.3636363636365, 845, 2476, 1571.0, 2267.5, 2445.8499999999995, 2476.0, 0.10179765402679129, 0.052688238900585334, 0.04682294438146357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 338.8333333333333, 285, 582, 291.0, 582.0, 582.0, 582.0, 0.04432656860644656, 0.06869752380706122, 0.09969149169985002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87c87aa4-8bd4-4ddb-b901-0bcb72583977", 3, 0, 0.0, 432.33333333333337, 256, 751, 290.0, 751.0, 751.0, 751.0, 0.023666211749485258, 0.02388962325363079, 0.015176574591955065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09eb2465-26ef-4d04-a5d6-53a3268dc117", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 1464.5178571428573, 737, 2990, 1172.0, 2548.0, 2740.5499999999997, 2990.0, 0.26928643902345195, 93.0894677520473, 0.9772950733204461], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 259.3157894736842, 141, 838, 146.0, 568.0, 588.6999999999999, 838.0, 0.25623850860197167, 0.19042725102158248, 0.12386529468552342], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 930.9473684210526, 687, 1300, 845.0, 1243.0, 1293.4, 1300.0, 0.25645178706403193, 75.40534039756776, 0.12897721712693014], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 215.12280701754386, 139, 447, 147.0, 423.0, 437.4, 447.0, 0.25708911971783344, 0.4549272313756974, 0.12502966955027445], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1362.771929824561, 963, 2123, 1270.0, 1725.4, 1849.599999999999, 2123.0, 0.2558107180202943, 230.1789337419386, 0.12840498931878055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 150.61538461538464, 144, 160, 150.0, 158.8, 160.0, 160.0, 0.11871712448860315, 0.08869003929080216, 0.04220022784555815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 6, 3.5502958579881656, 220.46153846153842, 142, 1521, 154.0, 390.0, 431.5, 950.5000000000093, 0.6860910268225053, 1.5262250619613271, 0.32777006080430976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 166.14285714285714, 142, 426, 146.5, 290.0, 426.0, 426.0, 0.06360976318993876, 0.04926029512658343, 0.02261128300892354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a26a33cc-1a6d-429c-bdff-2d2d3adc9e73", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9214f80-3189-43a1-bd80-ebb9a42e7f63", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8f41de1-6f7e-48d3-90c0-3016b90aa9de", 3, 0, 0.0, 327.6666666666667, 236, 498, 249.0, 498.0, 498.0, 498.0, 0.015498269359921477, 0.021365615475021957, 0.009938668827814228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 148.78571428571428, 144, 173, 147.0, 162.5, 173.0, 173.0, 0.06808047111686014, 0.055248897947373796, 0.024200479967321373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4ca0cf5-72d1-4ab2-9134-c7635e505a21", 3, 0, 0.0, 565.0, 260, 814, 621.0, 814.0, 814.0, 814.0, 0.06185184421582171, 0.027986348782549533, 0.03966410582850545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccd1288e-52f4-48c1-a24a-17f4734655ef", 3, 0, 0.0, 371.6666666666667, 255, 586, 274.0, 586.0, 586.0, 586.0, 0.025122682432545597, 0.025196284041234696, 0.016110574346391546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a05eb08-9536-421e-a38f-1e605f89c5e2", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 352.07142857142856, 283, 570, 290.0, 569.5, 570.0, 570.0, 0.06326225367259976, 0.09804413728360921, 0.14227829121874733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 406.0666666666667, 285, 1436, 293.0, 916.4000000000003, 1436.0, 1436.0, 0.0901637373470222, 7.321565494187444, 0.20124240934036208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecc3142b-d6a3-413f-b9a0-4cc14a0bdb62", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 168.93333333333334, 143, 435, 149.0, 271.80000000000007, 435.0, 435.0, 0.08488051652623657, 0.0703745688777098, 0.030172371108935656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2a6ea8c-a553-410b-83c0-e9e5337531c9", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.5496315619621343, 1.0269874139414803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 163.84210526315786, 140, 416, 148.0, 189.0, 416.0, 416.0, 0.11253257521914238, 0.08736659892501776, 0.04000181384742952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec475c88-3af7-45c4-9b5a-2f3611fc919b", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 143.53846153846152, 139, 146, 144.0, 146.0, 146.0, 146.0, 0.118165704676635, 0.08781650513566332, 0.059313644730264056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 254.53846153846155, 139, 435, 150.0, 434.6, 435.0, 435.0, 0.11785290144777757, 0.0587670943367148, 0.06569024404616207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 405.23076923076917, 139, 1669, 146.0, 1570.6, 1669.0, 1669.0, 0.1181635565412618, 16.384452942499795, 0.06790498854722453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 423.92307692307696, 142, 1123, 418.0, 1120.6, 1123.0, 1123.0, 0.11816140848398912, 5.372083458311746, 0.06801914612476026], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.4622496147919877], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07704160246533127], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.6163328197226502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 17, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
