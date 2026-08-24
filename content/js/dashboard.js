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

    var data = {"OkPercent": 99.31506849315069, "KoPercent": 0.684931506849315};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8227599738391105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/013d1427-5d75-43d9-803d-7a9ab5a70cfe"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66af1e9f-013f-40cf-b87f-87493ab49da3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6dc4948-19db-4402-a5df-f7dab839f9be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9c946a2d-7f61-4413-baa4-7753c23f0b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5da14bb2-6acd-4d14-b4e5-089328b16a23"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e7cf6885-b645-4831-93a4-20375660ff90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d83b6ad0-a5b4-42b2-9474-f8276fa6b0dc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f16e1d6a-43b0-463e-96b1-dc1ab8955062"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23dc7f01-1003-4c9d-b087-c4ba403a8f55"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce28ae16-ebcf-4cba-84af-66082544f1aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c946a2d-7f61-4413-baa4-7753c23f0b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b41f1af-10a8-428e-8643-4460098988e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58391d54-fa84-467a-9be1-83eb1132cfb6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/892d01c9-37cb-4fea-9041-36f9ce25bb0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a7f6a90-a84d-404a-bab4-4f1e950d281b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66af1e9f-013f-40cf-b87f-87493ab49da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6dc4948-19db-4402-a5df-f7dab839f9be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=013d1427-5d75-43d9-803d-7a9ab5a70cfe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=256fbbdd-f349-487d-844e-f8d0c9356ca8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5da14bb2-6acd-4d14-b4e5-089328b16a23"], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7cf6885-b645-4831-93a4-20375660ff90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f16e1d6a-43b0-463e-96b1-dc1ab8955062"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.853448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9738372093023255, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d83b6ad0-a5b4-42b2-9474-f8276fa6b0dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=892d01c9-37cb-4fea-9041-36f9ce25bb0c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23dc7f01-1003-4c9d-b087-c4ba403a8f55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58391d54-fa84-467a-9be1-83eb1132cfb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b41f1af-10a8-428e-8643-4460098988e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/256fbbdd-f349-487d-844e-f8d0c9356ca8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb8e9e7b-6cc0-4e1d-9377-d20bfbc0916b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce28ae16-ebcf-4cba-84af-66082544f1aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 9, 0.684931506849315, 309.93455098934527, 77, 2695, 98.0, 850.0, 1035.75, 1652.9499999999994, 5.20165312811743, 751.6536291328204, 3.8030508806489793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1320.7413793103447, 948, 1689, 1334.0, 1587.4, 1650.75, 1689.0, 0.2675535914456658, 321.9577752933287, 1.3155589188759058], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/013d1427-5d75-43d9-803d-7a9ab5a70cfe", 3, 0, 0.0, 664.0, 208, 1348, 436.0, 1348.0, 1348.0, 1348.0, 0.07025596590243788, 0.031788994988407766, 0.045053467717383666], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 750.2142857142857, 415, 1654, 660.5, 1489.0, 1654.0, 1654.0, 0.07303763525004955, 0.013195275899667158, 0.049642767709018064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 750.2142857142857, 415, 1654, 660.5, 1489.0, 1654.0, 1654.0, 0.07275372862859222, 0.013143984176064024, 0.04944979992724627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 106.94117647058822, 77, 235, 80.0, 234.2, 235.0, 235.0, 0.08919436501482202, 0.03962713804139668, 0.04998737506230489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 99.05882352941177, 78, 239, 80.0, 235.8, 239.0, 239.0, 0.08919062134384034, 0.0662832644947876, 0.04476951110423236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 180.52941176470586, 79, 626, 81.0, 618.8, 626.0, 626.0, 0.08919249314004796, 3.106571256932093, 0.05162077024276098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 179.41176470588232, 79, 928, 80.0, 798.3999999999999, 928.0, 928.0, 0.08919342906761386, 9.463142045126627, 0.05153420895921761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66af1e9f-013f-40cf-b87f-87493ab49da3", 3, 0, 0.0, 305.3333333333333, 190, 448, 278.0, 448.0, 448.0, 448.0, 0.022948587514438488, 0.02712445353675981, 0.0147163793631002], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 380.5714285714286, 174, 1659, 285.5, 1049.0, 1659.0, 1659.0, 0.07312079555425563, 0.1640372423144821, 0.04727145181339573], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6dc4948-19db-4402-a5df-f7dab839f9be", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 95.18181818181819, 80, 236, 81.0, 205.4000000000001, 236.0, 236.0, 0.09413133888993479, 0.06995502821800818, 0.047249519716236796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c946a2d-7f61-4413-baa4-7753c23f0b59", 3, 0, 0.0, 829.3333333333334, 402, 1647, 439.0, 1647.0, 1647.0, 1647.0, 0.05877167205406994, 0.03778452223528259, 0.03768886521696542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 109.81818181818181, 77, 255, 81.0, 251.0, 255.0, 255.0, 0.09400905905478164, 0.06366309503461243, 0.05146128001880181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 592.2, 475, 628, 620.0, 628.0, 628.0, 628.0, 0.10632190018500011, 31.26216887373211, 0.06063670869925787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 782.2, 697, 859, 778.0, 859.0, 859.0, 859.0, 0.10595465140919687, 95.33818158640602, 0.06032379079254079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 145.2, 79, 238, 92.0, 238.0, 238.0, 238.0, 0.10754538415211219, 0.1903049180504173, 0.05954905548266369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 98.5, 78, 237, 81.0, 232.5, 237.0, 237.0, 0.0858405940169106, 0.06379364457702047, 0.043087954418644575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 140.5, 77, 239, 81.0, 238.1, 239.0, 239.0, 0.08578005041960741, 0.03011051031981662, 0.04852120256482351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 157.5, 78, 694, 80.0, 286.30000000000064, 694.0, 694.0, 0.08578045921139164, 4.309914262728867, 0.050019985655600986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 153.2777777777778, 78, 622, 80.0, 280.00000000000057, 622.0, 622.0, 0.08584509729111027, 1.4241474359738648, 0.05014151027756581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5da14bb2-6acd-4d14-b4e5-089328b16a23", 3, 0, 0.0, 374.0, 232, 604, 286.0, 604.0, 604.0, 604.0, 0.017666387930323765, 0.024354541954726937, 0.011329031322505801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7cf6885-b645-4831-93a4-20375660ff90", 3, 0, 0.0, 767.3333333333334, 342, 1249, 711.0, 1249.0, 1249.0, 1249.0, 0.01742332285998037, 0.02401945713281799, 0.011173159516328558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 111.4, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.10718573143543132, 0.07965658361558908, 0.0601873003665752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d83b6ad0-a5b4-42b2-9474-f8276fa6b0dc", 1, 0, 0.0, 987.0, 987, 987, 987.0, 987.0, 987.0, 987.0, 1.0131712259371835, 0.18304362968591692, 0.6985340678824722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f16e1d6a-43b0-463e-96b1-dc1ab8955062", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 492.1499999999999, 78, 1024, 464.5, 1006.3000000000002, 1023.5, 1024.0, 0.10090562801140233, 45.411129338942004, 0.05498568401402588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 289.3636363636364, 79, 857, 80.0, 839.0, 857.0, 857.0, 0.09358675492181252, 22.984579654558527, 0.05282533627422621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 340.55, 77, 700, 350.0, 632.9, 696.65, 700.0, 0.10090562801140233, 14.84840111879115, 0.055084224666380764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 256.1818181818182, 78, 629, 81.0, 627.6, 629.0, 629.0, 0.0936991575593925, 7.5321844627631025, 0.052980285377820555], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 536.1428571428571, 172, 1098, 466.0, 1042.5, 1098.0, 1098.0, 0.07259565774258617, 0.013115426447635197, 0.05005130309205648], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 283.77777777777777, 159, 775, 242.5, 507.70000000000044, 775.0, 775.0, 0.0857440919938836, 5.824378645612523, 0.19162167086653933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 671.5714285714284, 90, 1490, 534.0, 1340.4, 1477.6999999999998, 1490.0, 0.0885224341140169, 0.05437559673605139, 0.040025280268349436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 81.39999999999999, 79, 90, 81.0, 84.9, 89.75, 90.0, 0.10090359166334527, 0.0749879231013728, 0.0506488731591401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 111.65, 78, 246, 80.0, 240.70000000000002, 245.75, 246.0, 0.10090562801140233, 0.10277790040614515, 0.053310492923992835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23dc7f01-1003-4c9d-b087-c4ba403a8f55", 1, 0, 0.0, 905.0, 905, 905, 905.0, 905.0, 905.0, 905.0, 1.1049723756906078, 0.19962879834254144, 0.7618266574585635], "isController": false}, {"data": ["login", 21, 0, 0.0, 2831.3809523809523, 1795, 4054, 2813.0, 3727.8, 4025.2999999999997, 4054.0, 0.0894900346454277, 25.61382156938887, 0.17035317002467368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce28ae16-ebcf-4cba-84af-66082544f1aa", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 87.0, 80, 95, 86.0, 94.6, 95.0, 95.0, 0.09609168894246728, 0.07779297864580603, 0.034157592553767664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c946a2d-7f61-4413-baa4-7753c23f0b59", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b41f1af-10a8-428e-8643-4460098988e1", 3, 0, 0.0, 292.0, 181, 476, 219.0, 476.0, 476.0, 476.0, 0.07455824241369882, 0.03373566307130253, 0.047812414568680565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58391d54-fa84-467a-9be1-83eb1132cfb6", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/892d01c9-37cb-4fea-9041-36f9ce25bb0c", 3, 0, 0.0, 411.0, 180, 703, 350.0, 703.0, 703.0, 703.0, 0.021744330165909237, 0.021808034258192173, 0.01394411797748737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a7f6a90-a84d-404a-bab4-4f1e950d281b", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 575.25, 160, 1110, 545.0, 1090.1000000000001, 1109.4, 1110.0, 0.1008628819551261, 60.41169509844217, 0.21393962852200576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 316.4117647058824, 159, 1008, 167.0, 877.5999999999999, 1008.0, 1008.0, 0.08915273436680582, 12.66987467649357, 0.1978229934734954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 893.6, 802, 938, 933.0, 938.0, 938.0, 938.0, 0.10542740269050732, 126.12782611331336, 0.2377264382933412], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1021.695652173913, 119, 2385, 1012.0, 1740.8000000000004, 2281.1999999999985, 2385.0, 0.09540797278798689, 0.030058048492139215, 0.04304539397270502], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 84.6875, 81, 98, 83.0, 95.9, 98.0, 98.0, 0.08894077100530866, 0.06905069623947302, 0.031615664693293306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 0, 0.0, 413.9090909090909, 161, 1093, 316.0, 1044.4, 1093.0, 1093.0, 0.09352071483833668, 30.619034069171324, 0.20380442002278507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 218.33333333333331, 159, 396, 162.0, 349.8, 396.0, 396.0, 0.08236915659474923, 0.12765610499596391, 0.18525016370869873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66af1e9f-013f-40cf-b87f-87493ab49da3", 1, 0, 0.0, 1098.0, 1098, 1098, 1098.0, 1098.0, 1098.0, 1098.0, 0.9107468123861566, 0.16453921903460836, 0.6279172358834244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 97.36363636363636, 81, 234, 84.0, 205.0000000000001, 234.0, 234.0, 0.06058102712377805, 0.04502164222772959, 0.03040883588049016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 93.54545454545455, 78, 235, 79.0, 204.2000000000001, 235.0, 235.0, 0.06058236172075938, 0.016210514757312566, 0.03455087816887058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 107.18181818181819, 78, 235, 80.0, 234.4, 235.0, 235.0, 0.06058236172075938, 0.016328839682548425, 0.035615802495993304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 79.90909090909092, 78, 82, 80.0, 81.8, 82.0, 82.0, 0.06058202806600136, 0.01632874975216443, 0.03567476848027229], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 903.0000000000001, 621, 1344, 853.5, 1254.5, 1305.6, 1344.0, 0.2624541270911485, 313.9863798186351, 0.5182443798616233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1021.695652173913, 119, 2385, 1012.0, 1740.8000000000004, 2281.1999999999985, 2385.0, 0.09391971905753604, 0.029589177794111642, 0.04237393574666177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6dc4948-19db-4402-a5df-f7dab839f9be", 3, 0, 0.0, 355.3333333333333, 180, 590, 296.0, 590.0, 590.0, 590.0, 0.024483000636558016, 0.02455472817748543, 0.015700361736334403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 147.0, 78, 240, 82.0, 240.0, 240.0, 240.0, 0.04509234267603729, 0.012153795486900675, 0.0265534010094243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 124.71428571428572, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.04513770223302661, 0.012166021304995455, 0.02653603197683791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 89.1875, 77, 234, 79.0, 128.30000000000013, 234.0, 234.0, 0.08932958149091072, 0.02407711376122203, 0.05251602349367993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 134.43749999999997, 78, 319, 81.0, 263.70000000000005, 319.0, 319.0, 0.08932808530832147, 0.02407671049325852, 0.05260237836027133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=013d1427-5d75-43d9-803d-7a9ab5a70cfe", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.6452287946428571, 2.462332589285714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=256fbbdd-f349-487d-844e-f8d0c9356ca8", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 146.71428571428572, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.04509234267603729, 0.01206572450511154, 0.025716726682427516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 101.12499999999999, 79, 258, 80.0, 243.3, 258.0, 258.0, 0.08932758659192926, 0.06638505214497867, 0.04483826123852699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 125.57142857142857, 80, 237, 81.0, 237.0, 237.0, 237.0, 0.04513712012277297, 0.03354428555999046, 0.022656718499126274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 108.875, 77, 240, 80.0, 235.1, 240.0, 240.0, 0.08932858403028239, 0.023902375023727905, 0.050945208079770425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 83.57142857142857, 81, 87, 84.0, 87.0, 87.0, 87.0, 0.04560676543789011, 0.035897512639589284, 0.016211779901749997], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 597.4285714285714, 402, 1348, 530.5, 1029.5, 1348.0, 1348.0, 0.07252007252007252, 0.013101770914270913, 0.04936180717430717], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1631.4285714285716, 1074, 2695, 1539.0, 2142.4, 2640.2999999999993, 2695.0, 0.09003331232556046, 0.04659927298100297, 0.04141180674349509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 296.2857142857143, 161, 478, 317.0, 478.0, 478.0, 478.0, 0.04506853636708967, 0.06984742892047979, 0.10136019458340577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5da14bb2-6acd-4d14-b4e5-089328b16a23", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["addBook", 57, 3, 5.2631578947368425, 893.7017543859648, 417, 1625, 774.0, 1495.0, 1589.3, 1625.0, 0.2597201401577458, 88.21959138503738, 0.9434878734616138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7cf6885-b645-4831-93a4-20375660ff90", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f16e1d6a-43b0-463e-96b1-dc1ab8955062", 3, 0, 0.0, 281.6666666666667, 181, 467, 197.0, 467.0, 467.0, 467.0, 0.02191668736576029, 0.026033200585175553, 0.014054646520360602], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 141.79310344827587, 79, 335, 81.0, 320.0, 322.05, 335.0, 0.26350461133069825, 0.19582715744400525, 0.12737771739130435], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 494.18965517241384, 385, 729, 467.0, 631.4000000000001, 709.4, 729.0, 0.2633359212898012, 77.42950443471312, 0.13243945260180431], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 112.56896551724141, 77, 335, 82.0, 238.0, 242.7999999999999, 335.0, 0.26361479515312386, 0.46647461798580114, 0.1282032890490778], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 759.1379310344829, 539, 1034, 770.0, 960.8000000000001, 1013.55, 1034.0, 0.2628942847689023, 236.55273955391826, 0.13196060778439042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 99.86666666666667, 80, 255, 86.0, 175.20000000000005, 255.0, 255.0, 0.08258138395388655, 0.06169410031711251, 0.02935510132735811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, 1.744186046511628, 154.5988372093023, 80, 626, 90.0, 303.70000000000005, 385.7, 546.4300000000011, 0.7200931097137212, 1.5951226774903917, 0.3445553621293823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 97.18181818181817, 80, 235, 83.0, 206.6000000000001, 235.0, 235.0, 0.06401042788061473, 0.04957057549739012, 0.022753706785687267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d83b6ad0-a5b4-42b2-9474-f8276fa6b0dc", 3, 0, 0.0, 808.0, 335, 1659, 430.0, 1659.0, 1659.0, 1659.0, 0.03559183286075288, 0.029323870107605975, 0.022824189692605204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 86.29411764705883, 80, 105, 83.0, 101.8, 105.0, 105.0, 0.08509615865928499, 0.06905752719322834, 0.03024902514841771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=892d01c9-37cb-4fea-9041-36f9ce25bb0c", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23dc7f01-1003-4c9d-b087-c4ba403a8f55", 3, 0, 0.0, 353.0, 174, 528, 357.0, 528.0, 528.0, 528.0, 0.015424640348802534, 0.021264111939185783, 0.009891452307012041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 206.00000000000003, 161, 470, 164.0, 439.2000000000001, 470.0, 470.0, 0.06055401418064914, 0.0938468950241115, 0.13618739712698727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 245.87499999999994, 159, 493, 163.5, 482.5, 493.0, 493.0, 0.08928770731489541, 0.13837850733275298, 0.20081014643184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58391d54-fa84-467a-9be1-83eb1132cfb6", 3, 0, 0.0, 471.3333333333333, 358, 660, 396.0, 660.0, 660.0, 660.0, 0.07678132678132678, 0.034741550854832104, 0.04923802531224406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b41f1af-10a8-428e-8643-4460098988e1", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 93.44444444444444, 80, 246, 83.0, 120.9000000000002, 246.0, 246.0, 0.08307602841200172, 0.06887846496268502, 0.029530931974578734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/256fbbdd-f349-487d-844e-f8d0c9356ca8", 3, 0, 0.0, 382.3333333333333, 215, 533, 399.0, 533.0, 533.0, 533.0, 0.039079291883231074, 0.025124219228314253, 0.02506061361001472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 93.60000000000001, 80, 251, 84.0, 94.0, 243.1499999999999, 251.0, 0.09827333746081351, 0.07629619461069018, 0.03493310042552355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb8e9e7b-6cc0-4e1d-9377-d20bfbc0916b", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce28ae16-ebcf-4cba-84af-66082544f1aa", 3, 0, 0.0, 343.6666666666667, 274, 464, 293.0, 464.0, 464.0, 464.0, 0.030704986489805942, 0.025297630470605095, 0.019690372195611237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 80.73333333333333, 79, 83, 81.0, 82.4, 83.0, 83.0, 0.08247649419915325, 0.0612935664898004, 0.04139933400230934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 131.4, 78, 238, 80.0, 236.8, 238.0, 238.0, 0.08240626287597858, 0.022050113308611455, 0.04699732179645653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 99.86666666666666, 77, 235, 79.0, 235.0, 235.0, 235.0, 0.08247876171885739, 0.022230603744535782, 0.048488490776125145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 105.19999999999999, 78, 315, 79.0, 267.0, 315.0, 315.0, 0.08247785469601412, 0.022230359273535057, 0.04856850232587551], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 66.66666666666667, 0.45662100456621], "isController": false}, {"data": ["401/Unauthorized", 3, 33.333333333333336, 0.228310502283105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 9, "406/Not Acceptable", 6, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
