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

    var data = {"OkPercent": 98.65871833084948, "KoPercent": 1.3412816691505216};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7718790218790219, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60784e34-4bd0-4fdb-b263-b90bb7e6a914"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8bd3508f-4da9-4137-bc80-a45882726b3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea895eeb-efd0-4291-9b86-c8d1d3bc9521"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=974b535a-e512-43d2-aa3b-3021cd6e848b"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9325d26f-5fba-40d4-9b61-592bca1e1c0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbf47669-631f-4dfc-9871-f1d5b582da73"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e12e1dd-8780-40af-b4ab-258d2eac743f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27080dcd-ea61-4f22-a744-a994bf4276a2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21c78b5a-493b-454b-9c9b-636cf5bee3dd"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0991d793-e524-46ae-8995-f25e53c3a08c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1599092f-9d50-4137-90c5-75a2c8274f84"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/974b535a-e512-43d2-aa3b-3021cd6e848b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e45cb04-1312-4f45-bfa6-03cb43e0140c"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9325d26f-5fba-40d4-9b61-592bca1e1c0a"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c93b4d2-50c5-4589-b6c7-18b418b3faf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd3508f-4da9-4137-bc80-a45882726b3c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30158730158730157, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea895eeb-efd0-4291-9b86-c8d1d3bc9521"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60784e34-4bd0-4fdb-b263-b90bb7e6a914"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9033555-fb73-4f5b-be4f-e171609c05db"], "isController": false}, {"data": [0.9453551912568307, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e12e1dd-8780-40af-b4ab-258d2eac743f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21c78b5a-493b-454b-9c9b-636cf5bee3dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9033555-fb73-4f5b-be4f-e171609c05db"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0991d793-e524-46ae-8995-f25e53c3a08c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1599092f-9d50-4137-90c5-75a2c8274f84"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/20ff3fb8-cfc7-41a5-a6d5-0158cb78dc0c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1c93b4d2-50c5-4589-b6c7-18b418b3faf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/026dfbac-98be-4171-82df-380668ece2cf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e45cb04-1312-4f45-bfa6-03cb43e0140c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 18, 1.3412816691505216, 397.5976154992549, 132, 3177, 148.0, 1065.5000000000002, 1222.85, 1630.8499999999997, 5.258455847779066, 725.3311017079695, 3.8502103859890755], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1976.7368421052638, 1604, 2819, 1944.0, 2336.8, 2509.8999999999996, 2819.0, 0.27138204879163574, 326.56346058681606, 1.3343834137362167], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60784e34-4bd0-4fdb-b263-b90bb7e6a914", 3, 0, 0.0, 292.3333333333333, 224, 412, 241.0, 412.0, 412.0, 412.0, 0.024704574463704863, 0.029199970663317823, 0.01584245172314407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd3508f-4da9-4137-bc80-a45882726b3c", 3, 0, 0.0, 731.6666666666666, 223, 1547, 425.0, 1547.0, 1547.0, 1547.0, 0.024584320120627067, 0.024656344495980465, 0.015765335494021912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea895eeb-efd0-4291-9b86-c8d1d3bc9521", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=974b535a-e512-43d2-aa3b-3021cd6e848b", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 487.84615384615387, 138, 676, 514.0, 653.6, 676.0, 676.0, 0.08448196310087795, 0.01600537191559602, 0.057110365530709195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 487.84615384615387, 138, 676, 514.0, 653.6, 676.0, 676.0, 0.08386880338571907, 0.01588920689143506, 0.056695865509922325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 205.5, 132, 426, 137.0, 418.3, 426.0, 426.0, 0.07475692319193374, 0.020003317338466643, 0.042634807757899705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 153.5, 133, 404, 137.0, 219.9000000000002, 404.0, 404.0, 0.07475587534457787, 0.055555880016820075, 0.03752394524132131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 213.43750000000003, 133, 555, 138.0, 454.2000000000001, 555.0, 555.0, 0.07475657390621787, 0.02014923281066029, 0.04402169342329041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 221.4375, 134, 418, 137.0, 416.6, 418.0, 418.0, 0.07475587534457787, 0.020149044526468252, 0.04394827827874597], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 276.92857142857144, 136, 973, 224.0, 635.0, 973.0, 973.0, 0.09010748535753363, 0.20179274674969427, 0.05824051055544828], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 155.29411764705884, 136, 422, 138.0, 203.5999999999998, 422.0, 422.0, 0.12210889240051717, 0.09074694054374371, 0.06129294013072834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 168.58823529411762, 134, 406, 137.0, 402.0, 406.0, 406.0, 0.12211064661178869, 0.032674137862920026, 0.06964122814578576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 736.0, 676, 955, 684.0, 955.0, 955.0, 955.0, 0.03997217936316324, 11.753147934037909, 0.022796633543054032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1075.8, 957, 1300, 971.0, 1300.0, 1300.0, 1300.0, 0.03988067701437299, 35.884703280285386, 0.02270550263611275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 247.0, 134, 417, 139.0, 417.0, 417.0, 417.0, 0.04014709897062838, 0.07104154622536975, 0.022229887808931925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9325d26f-5fba-40d4-9b61-592bca1e1c0a", 3, 0, 0.0, 287.6666666666667, 231, 393, 239.0, 393.0, 393.0, 393.0, 0.016722501240252177, 0.023053317953277332, 0.01072373940211484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 138.25, 134, 142, 138.0, 142.0, 142.0, 142.0, 0.0836658178072235, 0.06217742905400106, 0.04199631870401648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 187.68749999999997, 133, 412, 137.0, 412.0, 412.0, 412.0, 0.08366931793817883, 0.03809650340691004, 0.046839293464903335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 343.6875, 134, 1247, 140.0, 1242.8, 1247.0, 1247.0, 0.08366844287798526, 9.430358849375885, 0.0482891110750872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 289.0625, 132, 958, 139.0, 759.9000000000002, 958.0, 958.0, 0.08366888040579407, 3.094911069131413, 0.0483710714845997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 139.6, 133, 145, 140.0, 145.0, 145.0, 145.0, 0.04014871082489541, 0.029837079040767, 0.02254444211358873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbf47669-631f-4dfc-9871-f1d5b582da73", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 800.7999999999998, 134, 1360, 972.0, 1294.0, 1360.0, 1360.0, 0.10751377968276267, 64.50371807288718, 0.057046699506153375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 184.58823529411768, 134, 410, 138.0, 400.4, 410.0, 410.0, 0.1221115237363253, 0.032912871632056424, 0.07178822000905061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 651.0666666666667, 136, 1083, 924.0, 1014.0, 1083.0, 1083.0, 0.10751532093323299, 21.08504237895567, 0.05715251272264631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 185.7058823529412, 134, 411, 138.0, 408.6, 411.0, 411.0, 0.12210976949985275, 0.032912398810507185, 0.07190643653165157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e12e1dd-8780-40af-b4ab-258d2eac743f", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 461.75, 222, 570, 462.5, 567.9, 570.0, 570.0, 0.07992114447078881, 0.01443887863974212, 0.055101882808961826], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/27080dcd-ea61-4f22-a744-a994bf4276a2", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 516.6875, 272, 1381, 412.5, 1379.6, 1381.0, 1381.0, 0.08360548661005879, 12.616029147615937, 0.18535679294578708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21c78b5a-493b-454b-9c9b-636cf5bee3dd", 3, 0, 0.0, 501.3333333333333, 225, 837, 442.0, 837.0, 837.0, 837.0, 0.02400998815507251, 0.024080329917245576, 0.015397030164548454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 440.19047619047626, 140, 989, 517.0, 758.8000000000001, 966.4999999999997, 989.0, 0.0877684251000978, 0.05391244080855617, 0.039684356270845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 138.79999999999998, 135, 145, 138.0, 143.2, 145.0, 145.0, 0.10751223847647991, 0.07989923191464962, 0.053966104079014324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 249.33333333333331, 134, 456, 139.0, 441.0, 456.0, 456.0, 0.10751532093323299, 0.1364240628247859, 0.05529759344873312], "isController": false}, {"data": ["login", 21, 0, 0.0, 2289.9999999999995, 1240, 3641, 2091.0, 3326.6, 3609.6999999999994, 3641.0, 0.08640304138705682, 24.73026291596893, 0.16447677172522188], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0991d793-e524-46ae-8995-f25e53c3a08c", 3, 0, 0.0, 300.3333333333333, 218, 425, 258.0, 425.0, 425.0, 425.0, 0.07765783955890347, 0.03513815006083197, 0.0498001119567187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 141.94117647058823, 136, 149, 141.0, 148.2, 149.0, 149.0, 0.11469824241810883, 0.09285629195762912, 0.04077164085956212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1599092f-9d50-4137-90c5-75a2c8274f84", 3, 0, 0.0, 348.3333333333333, 289, 427, 329.0, 427.0, 427.0, 427.0, 0.01693939085950469, 0.023352317802735147, 0.010862825518627684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/974b535a-e512-43d2-aa3b-3021cd6e848b", 3, 0, 0.0, 391.66666666666663, 221, 689, 265.0, 689.0, 689.0, 689.0, 0.04687353520202493, 0.030440332919283775, 0.030058875113277712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e45cb04-1312-4f45-bfa6-03cb43e0140c", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 941.4666666666668, 276, 1501, 1114.0, 1435.6000000000001, 1501.0, 1501.0, 0.10740523278294119, 85.71815138364792, 0.22323646201792954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 437.25000000000006, 273, 831, 408.0, 737.2, 831.0, 831.0, 0.0747077060998842, 0.11578235310597287, 0.1680193819805013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 907.4285714285714, 136, 1434, 1098.0, 1434.0, 1434.0, 1434.0, 0.05577333715779074, 47.6644790571119, 0.10011656378477866], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1017.9047619047622, 156, 1942, 1005.0, 1626.8, 1910.5999999999995, 1942.0, 0.0857055402509948, 0.027069941842669115, 0.03866792929292929], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 389.11764705882354, 272, 833, 282.0, 606.5999999999998, 833.0, 833.0, 0.12198972415970608, 0.1890602463295445, 0.274357748769339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 143.4, 137, 156, 142.0, 154.8, 156.0, 156.0, 0.13068251119513513, 0.10145761367200433, 0.04645354890139569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 402.95238095238096, 272, 669, 279.0, 589.8, 661.0999999999999, 669.0, 0.13301241449201925, 0.2061432634754244, 0.29914803767101594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 138.3846153846154, 133, 143, 139.0, 142.2, 143.0, 143.0, 0.07058925740101214, 0.05245939929899438, 0.03543249834386743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 202.53846153846155, 132, 407, 140.0, 406.2, 407.0, 407.0, 0.07057890993588177, 0.027039696564978743, 0.03979607106210401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 241.15384615384616, 133, 928, 141.0, 717.9999999999998, 928.0, 928.0, 0.07057967631074603, 4.902769073139547, 0.04102655763916412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 202.7692307692308, 135, 949, 139.0, 635.7999999999997, 949.0, 949.0, 0.07057929312123351, 1.6139181178402737, 0.041095259989684566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9325d26f-5fba-40d4-9b61-592bca1e1c0a", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1326.3684210526314, 1055, 2243, 1108.0, 1773.2, 1934.1999999999996, 2243.0, 0.252674134591089, 302.2861087130464, 0.4989327149835762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1017.9047619047622, 156, 1942, 1005.0, 1626.8, 1910.5999999999995, 1942.0, 0.0869439211708448, 0.02746108224480924, 0.03922665193450225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 137.57142857142858, 135, 140, 138.0, 140.0, 140.0, 140.0, 0.03889429087373246, 0.010483226837060704, 0.022903571676621753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 136.57142857142858, 135, 138, 137.0, 138.0, 138.0, 138.0, 0.03889364255631244, 0.010483052095256086, 0.022865207830957118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c93b4d2-50c5-4589-b6c7-18b418b3faf2", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd3508f-4da9-4137-bc80-a45882726b3c", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 354.6666666666667, 133, 1222, 142.0, 1052.2, 1222.0, 1222.0, 0.13053239814121867, 15.69092905890492, 0.07524308939728841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 297.1333333333333, 132, 938, 139.0, 770.0000000000001, 938.0, 938.0, 0.13053467000835423, 5.148029035261765, 0.07537187423854776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 137.85714285714286, 135, 141, 138.0, 141.0, 141.0, 141.0, 0.03889429087373246, 0.010407261425197944, 0.022181900263925546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 156.6, 134, 408, 139.0, 252.60000000000008, 408.0, 408.0, 0.13052671881934233, 0.09700276662257765, 0.06551829440736519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 138.42857142857142, 136, 141, 138.0, 141.0, 141.0, 141.0, 0.03889385865971763, 0.02890451800785656, 0.019522893897553576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 174.26666666666668, 136, 409, 138.0, 409.0, 409.0, 409.0, 0.13053239814121867, 0.06106808678664044, 0.07298256739822824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 218.42857142857142, 139, 414, 146.0, 414.0, 414.0, 414.0, 0.03701079657808749, 0.02913154496283059, 0.013156181596117039], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 502.00000000000006, 393, 758, 442.0, 744.2, 758.0, 758.0, 0.07979398643502231, 0.014415905752421023, 0.05431289896993218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1245.4285714285716, 696, 3177, 1104.0, 1585.8, 3018.0999999999976, 3177.0, 0.08642046436596186, 0.044729341908163855, 0.03975003780895316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 278.42857142857144, 273, 282, 279.0, 282.0, 282.0, 282.0, 0.03886384330098381, 0.06023136652213018, 0.08740569445523995], "isController": false}, {"data": ["addBook", 63, 10, 15.873015873015873, 1180.142857142857, 696, 2061, 1076.0, 1894.8, 1977.1999999999998, 2061.0, 0.29001252117551746, 83.70543035498913, 1.0560875728483834], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea895eeb-efd0-4291-9b86-c8d1d3bc9521", 3, 0, 0.0, 435.0, 250, 758, 297.0, 758.0, 758.0, 758.0, 0.019734375308349615, 0.023325363523638492, 0.012655182082502844], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 267.87719298245605, 133, 852, 142.0, 549.4, 606.8999999999999, 852.0, 0.2537415753345382, 0.18857161995076524, 0.12265828104550432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60784e34-4bd0-4fdb-b263-b90bb7e6a914", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 796.140350877193, 656, 1102, 692.0, 967.2, 990.4999999999994, 1102.0, 0.2536896263196311, 74.59317342634544, 0.12758804448692385], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 213.15789473684205, 133, 560, 139.0, 416.6, 540.0999999999999, 560.0, 0.25427925215133634, 0.4499550829084193, 0.1236631519251616], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1052.8596491228072, 916, 1380, 953.0, 1244.8, 1356.8999999999999, 1380.0, 0.25367720688043793, 228.25919666798328, 0.12733406673490733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 169.19047619047618, 138, 421, 141.0, 361.6000000000002, 420.2, 421.0, 0.13244364838103406, 0.09894471778465924, 0.04707957813544571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9033555-fb73-4f5b-be4f-e171609c05db", 2, 0, 0.0, 233.5, 225, 242, 233.5, 242.0, 242.0, 242.0, 0.04730145215458115, 0.04180450605458588, 0.02940173271131924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, 5.46448087431694, 181.45355191256834, 135, 486, 144.0, 269.2, 339.1999999999998, 422.15999999999974, 0.7472193640060757, 1.5485446639656524, 0.3610770740951704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 163.61538461538458, 138, 421, 142.0, 312.9999999999999, 421.0, 421.0, 0.07514190259297367, 0.058190946051004014, 0.026710598187346103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e12e1dd-8780-40af-b4ab-258d2eac743f", 3, 0, 0.0, 322.3333333333333, 218, 448, 301.0, 448.0, 448.0, 448.0, 0.021486431318622292, 0.025396234413384615, 0.0137787336255488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 142.12500000000003, 136, 151, 141.0, 148.9, 151.0, 151.0, 0.07590420888838287, 0.061598044517818515, 0.026981574253292343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21c78b5a-493b-454b-9c9b-636cf5bee3dd", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9033555-fb73-4f5b-be4f-e171609c05db", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 384.6153846153846, 275, 1085, 282.0, 869.7999999999997, 1085.0, 1085.0, 0.07052530502194422, 6.5911068268495265, 0.15722502081852754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 549.3333333333334, 274, 1360, 545.0, 1190.2, 1360.0, 1360.0, 0.13037243057668071, 20.971211798161747, 0.28876305082351916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0991d793-e524-46ae-8995-f25e53c3a08c", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1599092f-9d50-4137-90c5-75a2c8274f84", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20ff3fb8-cfc7-41a5-a6d5-0158cb78dc0c", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.5209395391517129, 0.9733763254486134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c93b4d2-50c5-4589-b6c7-18b418b3faf2", 3, 0, 0.0, 668.3333333333334, 488, 973, 544.0, 973.0, 973.0, 973.0, 0.0187164274083363, 0.025802106143979237, 0.01200239648255941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 143.375, 138, 168, 141.0, 154.70000000000002, 168.0, 168.0, 0.08215323632405344, 0.06811337660070446, 0.02920290822456587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 148.13333333333333, 137, 204, 143.0, 182.4, 204.0, 204.0, 0.10750607409318627, 0.08346418838289364, 0.03821504977531231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/026dfbac-98be-4171-82df-380668ece2cf", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e45cb04-1312-4f45-bfa6-03cb43e0140c", 3, 0, 0.0, 336.3333333333333, 218, 559, 232.0, 559.0, 559.0, 559.0, 0.03335668301144134, 0.027808094138118907, 0.02139084164470685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 138.71428571428572, 134, 166, 137.0, 142.4, 163.69999999999996, 166.0, 0.13312962387711502, 0.09893715211961379, 0.06682483073519249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 220.1904761904762, 134, 534, 137.0, 421.8, 522.8999999999999, 534.0, 0.133132999866867, 0.035623478480001525, 0.07592741398657259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 187.47619047619048, 132, 412, 137.0, 408.8, 411.9, 412.0, 0.133132999866867, 0.0358835038703665, 0.07826764249985736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 204.23809523809524, 133, 451, 138.0, 418.8, 447.79999999999995, 451.0, 0.13313131185058863, 0.035883048897228965, 0.07839666117764155], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.37257824143070045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.14903129657228018], "isController": false}, {"data": ["401/Unauthorized", 11, 61.111111111111114, 0.819672131147541], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 18, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
