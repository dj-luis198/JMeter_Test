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

    var data = {"OkPercent": 97.16039907904835, "KoPercent": 2.83960092095165};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8138613861386138, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/023c564b-bd3f-42f5-b034-2fa154445522"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcde00c5-d51c-41db-a950-a17f066a2011"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcde00c5-d51c-41db-a950-a17f066a2011"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff8835ea-f35c-4481-9894-1026d39a4007"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9546e957-1c89-4374-8a57-6694e8953f7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70457e1a-e09b-4b28-8950-c2def552de78"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a61142b6-c7b2-4a47-9979-9a311f52aba0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca21be4b-c4eb-4709-9dd2-f44f41fbce9b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=023c564b-bd3f-42f5-b034-2fa154445522"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe5b0f10-59dc-4774-af6f-0e4d92f104ea"], "isController": false}, {"data": [0.8482142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4dda2d38-6beb-4334-ae07-e904a14c76a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4dda2d38-6beb-4334-ae07-e904a14c76a3"], "isController": false}, {"data": [0.896551724137931, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe5b0f10-59dc-4774-af6f-0e4d92f104ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca21be4b-c4eb-4709-9dd2-f44f41fbce9b"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/350a7eb6-ecb1-4b38-90ea-4faeb77ea174"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a61142b6-c7b2-4a47-9979-9a311f52aba0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70457e1a-e09b-4b28-8950-c2def552de78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9546e957-1c89-4374-8a57-6694e8953f7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00958f22-94e2-450a-94b9-42a638a95c17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a300d820-096a-4935-aa40-174c5b68c9a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ff8835ea-f35c-4481-9894-1026d39a4007"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a300d820-096a-4935-aa40-174c5b68c9a5"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00958f22-94e2-450a-94b9-42a638a95c17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70505e3b-5cd8-4995-9adf-9e58868e764d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 37, 2.83960092095165, 270.66999232540246, 80, 4321, 95.0, 661.0, 828.8, 1296.2800000000016, 5.202302907380643, 710.2795155455232, 3.8172830219470906], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/023c564b-bd3f-42f5-b034-2fa154445522", 3, 0, 0.0, 353.6666666666667, 172, 518, 371.0, 518.0, 518.0, 518.0, 0.07782504928919788, 0.03521380810937014, 0.049907339550690044], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1234.3749999999993, 989, 1644, 1194.0, 1440.4, 1573.7, 1644.0, 0.2482489582409788, 298.7272738607146, 1.2206381882259065], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 287.09523809523813, 166, 814, 177.0, 625.2, 798.3999999999997, 814.0, 0.10542592071970762, 12.15983373610637, 0.2345363942201494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 104.52631578947367, 83, 259, 86.0, 249.0, 259.0, 259.0, 0.09973753280839895, 0.07743294783464567, 0.035453576115485566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 279.4117647058823, 167, 848, 170.0, 602.3999999999997, 848.0, 848.0, 0.08951844343224244, 6.430291626076196, 0.19998177542718729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 102.11111111111111, 83, 248, 84.0, 248.0, 248.0, 248.0, 0.056868803669933465, 0.04226285116486266, 0.028545473717134572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 122.66666666666667, 81, 249, 83.0, 249.0, 249.0, 249.0, 0.05680993290115703, 0.015201095327067407, 0.03239941485769112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 87.00000000000001, 81, 121, 83.0, 121.0, 121.0, 121.0, 0.056869522359200536, 0.015328113448378271, 0.03343305904320188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcde00c5-d51c-41db-a950-a17f066a2011", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 89.0, 86, 95, 86.0, 95.0, 95.0, 95.0, 0.01701587013487913, 0.005018352324935056, 0.010518599409549306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 125.33333333333333, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.05681029149991794, 0.015312148880837258, 0.033453716576611836], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 798.5714285714284, 646, 1298, 666.5, 1088.6000000000001, 1212.35, 1298.0, 0.2593180860472978, 310.23458446592053, 0.5120519238160509], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 416.64285714285717, 85, 689, 394.5, 668.0, 689.0, 689.0, 0.07093815712801804, 0.014552812507917207, 0.047488385460211294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 416.64285714285717, 85, 689, 394.5, 668.0, 689.0, 689.0, 0.07154099298898269, 0.014676483006459129, 0.04789194403705823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1101.9545454545455, 228, 4321, 826.5, 1892.0, 3957.099999999995, 4321.0, 0.08872685035813384, 0.027632616393495516, 0.04003105943892366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 103.625, 81, 247, 83.0, 247.0, 247.0, 247.0, 0.05425935973955508, 0.014624593054801953, 0.03195155656538253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 118.92857142857142, 82, 249, 83.5, 248.0, 249.0, 249.0, 0.10968348480100282, 0.029348901206518334, 0.06255386242557193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 103.5, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.05425935973955508, 0.014624593054801953, 0.03189856890938687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcde00c5-d51c-41db-a950-a17f066a2011", 3, 0, 0.0, 354.3333333333333, 179, 443, 441.0, 443.0, 443.0, 443.0, 0.03335037908264224, 0.02747715151633057, 0.021386799086199615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 109.64285714285712, 82, 254, 85.5, 251.0, 254.0, 254.0, 0.10954188020812956, 0.08140758870936192, 0.05498488908884629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff8835ea-f35c-4481-9894-1026d39a4007", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 107.64285714285714, 82, 255, 83.0, 252.0, 255.0, 255.0, 0.10968348480100282, 0.02956312676277029, 0.06458900520996552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 142.7142857142857, 82, 253, 84.5, 251.0, 253.0, 253.0, 0.10968348480100282, 0.02956312676277029, 0.06448189243183955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 118.84210526315789, 81, 249, 84.0, 246.0, 249.0, 249.0, 0.09726979056278254, 0.02621724823762498, 0.05718399796757333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9546e957-1c89-4374-8a57-6694e8953f7a", 3, 0, 0.0, 390.3333333333333, 361, 429, 381.0, 429.0, 429.0, 429.0, 0.09079353550027237, 0.041081710398886265, 0.058223719054536646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 119.36842105263158, 81, 252, 84.0, 249.0, 252.0, 252.0, 0.09726680284019065, 0.026216442953020135, 0.057277228625620076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 110.10526315789474, 81, 248, 85.0, 242.0, 248.0, 248.0, 0.09726730078121, 0.07228556239697345, 0.048823625587443305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 83.12499999999999, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.05425899173228614, 0.014518519272115626, 0.030944581222319436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 127.94736842105262, 80, 254, 85.0, 249.0, 254.0, 254.0, 0.09726879463485807, 0.02602700168940538, 0.05547360944019249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 84.375, 83, 89, 84.0, 89.0, 89.0, 89.0, 0.05425678379349868, 0.04032169186216064, 0.027234362177596016], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 520.7142857142858, 83, 2366, 399.5, 1612.0, 2366.0, 2366.0, 0.07216941254098191, 0.014382534293358352, 0.049108023112254366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 89.5, 84, 94, 90.0, 94.0, 94.0, 94.0, 0.05357621216180016, 0.042170338869541926, 0.0190446691668899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70457e1a-e09b-4b28-8950-c2def552de78", 1, 0, 0.0, 1679.0, 1679, 1679, 1679.0, 1679.0, 1679.0, 1679.0, 0.5955926146515784, 0.10760218135795116, 0.41063318939845145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1132.6315789473686, 653, 2009, 1120.0, 1581.0, 2009.0, 2009.0, 0.0877963125548727, 0.04544145083406497, 0.040382874231782266], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 212.7142857142857, 83, 437, 192.5, 409.0, 437.0, 437.0, 0.0711960943856794, 0.13425747876830757, 0.04601226384509764], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 189.5, 167, 332, 169.0, 332.0, 332.0, 332.0, 0.054225891507547565, 0.08403954084226366, 0.12195530091980668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a61142b6-c7b2-4a47-9979-9a311f52aba0", 3, 0, 0.0, 363.0, 164, 488, 437.0, 488.0, 488.0, 488.0, 0.018337520400491445, 0.025279752244818123, 0.011759412496408902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 92.90476190476191, 83, 249, 85.0, 89.8, 233.09999999999977, 249.0, 0.10547092769214543, 0.07838220309933855, 0.05294146175172144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 138.66666666666666, 82, 258, 85.0, 247.8, 257.0, 258.0, 0.10547198714246252, 0.043309042339469125, 0.05930837372240778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 461.5, 404, 579, 408.5, 579.0, 579.0, 579.0, 0.03079639476871908, 9.055162598548463, 0.017563568891535097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca21be4b-c4eb-4709-9dd2-f44f41fbce9b", 3, 0, 0.0, 242.0, 162, 359, 205.0, 359.0, 359.0, 359.0, 0.028041314202925646, 0.02337688986773847, 0.017982222975183437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 734.6666666666666, 724, 746, 734.0, 746.0, 746.0, 746.0, 0.03074526522915471, 27.664643697604944, 0.01750438440292695], "isController": false}, {"data": ["addBook", 59, 17, 28.8135593220339, 783.9661016949153, 425, 1885, 700.0, 1202.0, 1313.0, 1885.0, 0.2655875110849025, 65.6275109836191, 0.9684782932851375], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 141.33333333333331, 82, 255, 87.5, 255.0, 255.0, 255.0, 0.03081996517343935, 0.054536891498312604, 0.017065351809902454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=023c564b-bd3f-42f5-b034-2fa154445522", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 109.07142857142857, 82, 253, 86.0, 249.0, 253.0, 253.0, 0.07494967664568077, 0.055699906179065485, 0.03762122441003898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.00000000000001, 82, 249, 83.5, 247.5, 249.0, 249.0, 0.07495168293296643, 0.020055430784797657, 0.04274588167270742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 107.85714285714286, 81, 254, 84.0, 250.0, 254.0, 254.0, 0.07495168293296643, 0.020201820790526105, 0.04406339172426346], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 155.74999999999997, 82, 560, 86.0, 337.3, 365.6, 560.0, 0.2603331334346773, 0.19347022904666936, 0.125844629931802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 141.7142857142857, 81, 249, 85.5, 247.5, 249.0, 249.0, 0.07488593267754652, 0.020184099041994964, 0.04409786855914117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe5b0f10-59dc-4774-af6f-0e4d92f104ea", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 469.4107142857142, 400, 673, 412.5, 601.0000000000003, 659.9499999999999, 673.0, 0.2602871525050314, 76.53306518333977, 0.1309061362696203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 84.16666666666667, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.030847060275155776, 0.022924426630267135, 0.01732134732247517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4dda2d38-6beb-4334-ae07-e904a14c76a3", 1, 0, 0.0, 844.0, 844, 844, 844.0, 844.0, 844.0, 844.0, 1.1848341232227488, 0.2140569460900474, 0.8168875888625593], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 124.92857142857139, 82, 357, 87.0, 249.0, 268.79999999999984, 357.0, 0.2603585509186937, 0.4607125920553448, 0.12661968589600536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 161.19047619047615, 83, 730, 84.0, 499.8000000000002, 713.1999999999998, 730.0, 0.10547198714246252, 9.064185275985034, 0.061142754451168985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 497.99999999999994, 82, 747, 571.0, 746.6, 747.0, 747.0, 0.060861708154064394, 37.91822033489155, 0.032159048614459805], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 641.0535714285716, 562, 859, 576.5, 755.1, 844.4, 859.0, 0.25977279158336153, 233.74401449856893, 0.130393764525242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 138.14285714285714, 81, 572, 85.0, 371.60000000000014, 555.0999999999998, 572.0, 0.10547304661406408, 2.9792996589704823, 0.06124636965540449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 87.82352941176471, 84, 104, 87.0, 92.79999999999998, 104.0, 104.0, 0.0859988769558421, 0.06424720788205002, 0.030569913292897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 443.76923076923083, 83, 666, 571.0, 640.0, 666.0, 666.0, 0.06086227802824946, 12.394260935897975, 0.032218785551763364], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 427.7857142857142, 86, 1679, 364.5, 1261.5, 1679.0, 1679.0, 0.07167357804740696, 0.014703682550043515, 0.04832067046792607], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4dda2d38-6beb-4334-ae07-e904a14c76a3", 3, 0, 0.0, 293.6666666666667, 228, 401, 252.0, 401.0, 401.0, 401.0, 0.01607691194675327, 0.022163320994303414, 0.010309738455437478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, 9.770114942528735, 140.66666666666669, 83, 887, 90.0, 263.0, 372.0, 845.75, 0.7373912453860074, 1.5423071605351595, 0.3537512991753084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 146.44444444444446, 84, 256, 93.0, 256.0, 256.0, 256.0, 0.060493221398468855, 0.046846801336900196, 0.021503449793986974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 265.28571428571433, 169, 503, 179.0, 497.0, 503.0, 503.0, 0.07485109977651601, 0.1160045852981747, 0.1683418777200355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 91.85714285714286, 85, 115, 88.0, 112.0, 115.0, 115.0, 0.11414315181854501, 0.09262984293087001, 0.040574323497998416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe5b0f10-59dc-4774-af6f-0e4d92f104ea", 3, 0, 0.0, 379.3333333333333, 271, 595, 272.0, 595.0, 595.0, 595.0, 0.09092837874700693, 0.04114272345649077, 0.05831019079804807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca21be4b-c4eb-4709-9dd2-f44f41fbce9b", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 496.6315789473684, 88, 952, 410.0, 844.0, 952.0, 952.0, 0.08525646490799033, 0.05236944963586515, 0.03854857739492141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 98.76923076923077, 83, 247, 86.0, 184.59999999999994, 247.0, 247.0, 0.06086142322097378, 0.045230022530430715, 0.030549581577715357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 137.15384615384616, 83, 259, 86.0, 255.8, 259.0, 259.0, 0.060861708154064394, 0.07957009981320137, 0.031171508878786888], "isController": false}, {"data": ["login", 19, 0, 0.0, 2113.4210526315787, 1486, 2891, 2099.0, 2889.0, 2891.0, 2891.0, 0.08822150097275813, 33.44868149484369, 0.17930421530457313], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 228.44444444444446, 166, 496, 168.0, 496.0, 496.0, 496.0, 0.05677911033442896, 0.0879965313483777, 0.1276975499025292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350a7eb6-ecb1-4b38-90ea-4faeb77ea174", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 91.14285714285714, 83, 118, 87.0, 105.80000000000001, 116.89999999999998, 118.0, 0.10270857176394636, 0.08314981053936674, 0.03650968761921531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a61142b6-c7b2-4a47-9979-9a311f52aba0", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 265.7368421052632, 168, 503, 186.0, 489.0, 503.0, 503.0, 0.09722300398614317, 0.15067666731055587, 0.21865681462899192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70457e1a-e09b-4b28-8950-c2def552de78", 3, 0, 0.0, 306.0, 186, 398, 334.0, 398.0, 398.0, 398.0, 0.021919569791910214, 0.0262934943630173, 0.014056494951192424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9546e957-1c89-4374-8a57-6694e8953f7a", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 1.1434434335443038, 4.363627373417722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00958f22-94e2-450a-94b9-42a638a95c17", 3, 0, 0.0, 259.6666666666667, 173, 334, 272.0, 334.0, 334.0, 334.0, 0.031424800452517124, 0.026197563137661577, 0.02015197164435506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 107.21428571428572, 83, 273, 88.0, 213.0, 273.0, 273.0, 0.07421110940307765, 0.06152854676095011, 0.026379730295625254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 611.8461538461538, 168, 839, 661.0, 837.8, 839.0, 839.0, 0.06083721365561457, 50.41686653251281, 0.1260480160633643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a300d820-096a-4935-aa40-174c5b68c9a5", 3, 0, 0.0, 912.6666666666666, 173, 2366, 199.0, 2366.0, 2366.0, 2366.0, 0.01784354777312524, 0.021090469389393796, 0.011442639685239819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 90.76923076923076, 85, 105, 89.0, 101.39999999999999, 105.0, 105.0, 0.05849005669036264, 0.0454097608094124, 0.020791387339152347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff8835ea-f35c-4481-9894-1026d39a4007", 3, 0, 0.0, 670.0, 213, 939, 858.0, 939.0, 939.0, 939.0, 0.015836650231742983, 0.0218321008240337, 0.010155664373871639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a300d820-096a-4935-aa40-174c5b68c9a5", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 451.5833333333333, 83, 830, 448.5, 829.4, 830.0, 830.0, 0.0580596466102843, 34.73752881814751, 0.0846939425040158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 265.78571428571433, 167, 503, 181.0, 498.5, 503.0, 503.0, 0.10947078693857125, 0.1696583387417115, 0.2462023655464156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00958f22-94e2-450a-94b9-42a638a95c17", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70505e3b-5cd8-4995-9adf-9e58868e764d", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 117.29411764705881, 82, 291, 85.0, 277.4, 291.0, 291.0, 0.08978983895928296, 0.0667285814922015, 0.04507029025885883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 103.05882352941177, 81, 254, 83.0, 250.0, 254.0, 254.0, 0.08970976253298153, 0.03193024406332454, 0.05071940963060686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 160.05882352941177, 82, 568, 83.0, 312.7999999999998, 568.0, 568.0, 0.08956136006827736, 4.763158975694628, 0.05219953810045624], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1101.9545454545455, 228, 4321, 826.5, 1892.0, 3957.099999999995, 4321.0, 0.0887705281846427, 0.027646219182504133, 0.04005076564580559], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 131.64705882352942, 81, 573, 83.0, 315.39999999999975, 573.0, 573.0, 0.08955900094300359, 1.5717378298537028, 0.05228562308040818], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.62162162162162, 0.6139677666922486], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.23023791250959325], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.23023791250959325], "isController": false}, {"data": ["401/Unauthorized", 23, 62.16216216216216, 1.765157329240215], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 37, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
