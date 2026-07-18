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

    var data = {"OkPercent": 98.50393700787401, "KoPercent": 1.4960629921259843};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7778152393796359, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/17942f2a-14e6-409a-9612-f36d12c261ca"], "isController": false}, {"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fa6a18e-8cd3-4b7d-b6bf-e3d302e822f3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54ac526f-081b-45c1-b2eb-3742515f69fe"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3c7d985-7d85-4760-a7ec-d8822045f252"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43c578cd-b2f6-4e38-8d56-e01cd1e6dee6"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5031a40-4338-4e7a-b16a-5c273536972f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d94e0c3-63b9-412a-906a-6636fc818dc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2162cbb6-1add-4983-afef-83862103ddcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/608aa9ac-ebfe-46f5-a6f4-4dd573968be0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f60b3374-5c21-4fe9-b327-6b00908e3e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d5f99a3-ed71-4787-9bdc-b72d64af9b23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ffb1c2ec-7dcd-4c2c-a331-016f6469c3b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e4f28c8-9787-4961-ab07-116b28d1bac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a01b90c2-4d34-409e-ae03-6914908b1074"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17942f2a-14e6-409a-9612-f36d12c261ca"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54ac526f-081b-45c1-b2eb-3742515f69fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=608aa9ac-ebfe-46f5-a6f4-4dd573968be0"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43c578cd-b2f6-4e38-8d56-e01cd1e6dee6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a01b90c2-4d34-409e-ae03-6914908b1074"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3c7d985-7d85-4760-a7ec-d8822045f252"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d5f99a3-ed71-4787-9bdc-b72d64af9b23"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f60b3374-5c21-4fe9-b327-6b00908e3e4b"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6203703703703703, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5031a40-4338-4e7a-b16a-5c273536972f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa56ecc3-0812-49cb-8a1f-592077353942"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e111d904-46e8-4fdb-9d92-68815937cc09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8187cb0-3ee9-430d-bf3d-309d0c7af084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa56ecc3-0812-49cb-8a1f-592077353942"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e4f28c8-9787-4961-ab07-116b28d1bac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffb1c2ec-7dcd-4c2c-a331-016f6469c3b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2162cbb6-1add-4983-afef-83862103ddcd"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1270, 19, 1.4960629921259843, 372.68110236220457, 95, 3282, 117.5, 1046.0, 1212.45, 1817.3499999999995, 5.003683814461828, 719.7047429480563, 3.644927103073917], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/17942f2a-14e6-409a-9612-f36d12c261ca", 3, 0, 0.0, 538.6666666666666, 313, 751, 552.0, 751.0, 751.0, 751.0, 0.04212654815064453, 0.02708331139242284, 0.027014746047125567], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1651.9814814814815, 1232, 2162, 1606.5, 2064.0, 2084.5, 2162.0, 0.2447081854888046, 294.4672336022858, 1.2032282362657531], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2fa6a18e-8cd3-4b7d-b6bf-e3d302e822f3", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.7018372252747253, 1.3113839285714286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54ac526f-081b-45c1-b2eb-3742515f69fe", 3, 0, 0.0, 479.33333333333337, 210, 979, 249.0, 979.0, 979.0, 979.0, 0.10392849719393057, 0.04702493850897249, 0.06664685529688907], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 668.2857142857143, 104, 1244, 506.5, 1212.0, 1244.0, 1244.0, 0.07316435850535667, 0.01381528449176901, 0.04947882643062451], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 668.2857142857143, 104, 1244, 506.5, 1212.0, 1244.0, 1244.0, 0.073827980804725, 0.013940593194642198, 0.04992761397194537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 155.49999999999997, 96, 300, 102.0, 299.0, 300.0, 300.0, 0.13448219551790053, 0.07926719811148575, 0.07427664788718866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 128.85714285714283, 98, 298, 101.0, 297.5, 298.0, 298.0, 0.13447702844189152, 0.09993849476980414, 0.06750116466712133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 305.9285714285714, 98, 809, 199.0, 808.0, 809.0, 809.0, 0.13357121731082977, 8.444224028746435, 0.07619596924999761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 329.2142857142857, 95, 1046, 104.0, 1017.0, 1046.0, 1046.0, 0.13326860286908265, 25.72436356805266, 0.07589319711378283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3c7d985-7d85-4760-a7ec-d8822045f252", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43c578cd-b2f6-4e38-8d56-e01cd1e6dee6", 3, 0, 0.0, 279.6666666666667, 193, 449, 197.0, 449.0, 449.0, 449.0, 0.024804048020636967, 0.02487671613007243, 0.015906241731983992], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 225.64285714285717, 98, 313, 217.0, 304.5, 313.0, 313.0, 0.07321409894362514, 0.1300193739540843, 0.047326663986507686], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5031a40-4338-4e7a-b16a-5c273536972f", 3, 0, 0.0, 325.3333333333333, 203, 466, 307.0, 466.0, 466.0, 466.0, 0.04454938299104557, 0.02864096074456869, 0.028568451983190035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d94e0c3-63b9-412a-906a-6636fc818dc8", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.8677606997282609, 1.6214121942934783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2162cbb6-1add-4983-afef-83862103ddcd", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 115.3125, 98, 314, 101.0, 177.50000000000014, 314.0, 314.0, 0.11243851018973998, 0.08356026001405481, 0.056438861560084326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 136.4375, 97, 297, 100.0, 297.0, 297.0, 297.0, 0.11229961537381734, 0.05113251530082259, 0.0628669477666414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 736.8, 581, 793, 768.0, 793.0, 793.0, 793.0, 0.03144792538036265, 9.246734231224016, 0.01793514494348808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1033.6, 689, 1185, 1085.0, 1185.0, 1185.0, 1185.0, 0.031372745868209366, 28.22925187961964, 0.01786163168082623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 138.8, 97, 296, 98.0, 296.0, 296.0, 296.0, 0.03158340229042833, 0.05588781733423451, 0.01748807529167272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/608aa9ac-ebfe-46f5-a6f4-4dd573968be0", 3, 0, 0.0, 464.33333333333337, 208, 976, 209.0, 976.0, 976.0, 976.0, 0.09603995262029004, 0.04345557752024842, 0.061588120658193815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 113.73333333333333, 96, 293, 100.0, 180.80000000000007, 293.0, 293.0, 0.07733633054578826, 0.05747358158725085, 0.038819212793491376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 127.4, 97, 304, 101.0, 296.8, 304.0, 304.0, 0.07725467777073902, 0.020671661825373524, 0.04405930841612459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 140.73333333333335, 95, 302, 102.0, 298.4, 302.0, 302.0, 0.07726144241962235, 0.020824373152163837, 0.045421277672473295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f60b3374-5c21-4fe9-b327-6b00908e3e4b", 3, 0, 0.0, 329.3333333333333, 196, 446, 346.0, 446.0, 446.0, 446.0, 0.09127696473666595, 0.041300449539051334, 0.058533730641677065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d5f99a3-ed71-4787-9bdc-b72d64af9b23", 3, 0, 0.0, 351.0, 205, 471, 377.0, 471.0, 471.0, 471.0, 0.0200133422281521, 0.027590007921947966, 0.012834076884589726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 139.33333333333331, 95, 305, 99.0, 303.2, 305.0, 305.0, 0.07733792548748672, 0.020844987729049157, 0.04554176666890087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 99.4, 97, 101, 100.0, 101.0, 101.0, 101.0, 0.031582803794989706, 0.023471204773424965, 0.017734484552850666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 697.0, 99, 1322, 979.0, 1268.0, 1322.0, 1322.0, 0.09384237608896258, 46.92209429138579, 0.05068873135534458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 264.625, 96, 1177, 100.5, 1112.6000000000001, 1177.0, 1177.0, 0.11245431543435479, 12.674845045860275, 0.06490283244307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 507.55555555555554, 96, 1013, 587.0, 942.8000000000001, 1013.0, 1013.0, 0.09384188684753822, 15.340480685514983, 0.050780109560402895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 212.62499999999997, 98, 787, 102.5, 659.6000000000001, 787.0, 787.0, 0.11229252201986174, 4.153699292908025, 0.06491911429273256], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 572.7857142857142, 99, 2032, 500.0, 1495.5, 2032.0, 2032.0, 0.07413840581245101, 0.013999209300663009, 0.05073743718094007], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 283.80000000000007, 201, 597, 208.0, 482.4000000000001, 597.0, 597.0, 0.07721530716249189, 0.11966864498718226, 0.17365903554220588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 706.0, 158, 1330, 631.0, 1204.6, 1312.4499999999998, 1330.0, 0.1026866563357667, 0.06307608089374732, 0.04642961121431639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 112.1666666666667, 98, 307, 101.0, 125.20000000000029, 307.0, 307.0, 0.09384041915387223, 0.0697388271250945, 0.04710349164559602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 145.88888888888889, 97, 307, 101.5, 302.5, 307.0, 307.0, 0.0938413976112151, 0.10341289432937288, 0.04914047144875478], "isController": false}, {"data": ["login", 22, 0, 0.0, 2946.5, 1588, 4958, 2849.5, 3591.7, 4757.149999999997, 4958.0, 0.09827351305474281, 26.85577192867353, 0.18530978491501574], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ffb1c2ec-7dcd-4c2c-a331-016f6469c3b5", 3, 0, 0.0, 366.6666666666667, 210, 513, 377.0, 513.0, 513.0, 513.0, 0.018449390247652315, 0.0254219625385131, 0.01183115194917808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e4f28c8-9787-4961-ab07-116b28d1bac1", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 109.8125, 102, 136, 106.0, 130.4, 136.0, 136.0, 0.11146951657064032, 0.09024241136431721, 0.0396239297184698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 823.1666666666665, 201, 1424, 1081.0, 1370.0, 1424.0, 1424.0, 0.09379054487095984, 62.40132453091701, 0.1976053613020212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a01b90c2-4d34-409e-ae03-6914908b1074", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17942f2a-14e6-409a-9612-f36d12c261ca", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 503.78571428571433, 205, 1180, 399.5, 1164.0, 1180.0, 1180.0, 0.13313806417254692, 34.29342507477129, 0.2921310649143162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 848.2857142857143, 98, 1284, 1150.0, 1284.0, 1284.0, 1284.0, 0.043894027277002666, 37.51229620630193, 0.07900679965511836], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1217.4166666666667, 249, 3066, 1144.5, 1830.5, 2761.5, 3066.0, 0.10123592187961361, 0.0317845203948201, 0.0456748006917788], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 419.8125, 199, 1282, 309.0, 1215.5, 1282.0, 1282.0, 0.11219802952210652, 16.930630609901478, 0.2487476333228148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 119.92857142857143, 97, 311, 104.5, 213.5, 311.0, 311.0, 0.11405202401609764, 0.08854624911406017, 0.0405419304119722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 355.4615384615385, 202, 980, 393.0, 749.9999999999998, 980.0, 980.0, 0.1302096375164014, 12.16904528791354, 0.29028180683400273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 105.81818181818181, 95, 147, 102.0, 140.00000000000003, 147.0, 147.0, 0.05073051948051949, 0.03770109894987825, 0.02546434278612013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54ac526f-081b-45c1-b2eb-3742515f69fe", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 117.54545454545455, 96, 294, 100.0, 255.80000000000013, 294.0, 294.0, 0.0507312213772143, 0.01357456509507492, 0.02893264969169253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 125.0, 95, 391, 98.0, 333.4000000000002, 391.0, 391.0, 0.05073192329333198, 0.013673838700155885, 0.029824822092369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 98.0909090909091, 95, 101, 98.0, 100.8, 101.0, 101.0, 0.05073168931913461, 0.013673775636798, 0.029874227206482588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 2.9790088383838382, 6.2440814393939394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=608aa9ac-ebfe-46f5-a6f4-4dd573968be0", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1127.5740740740741, 774, 1731, 1027.5, 1626.5, 1668.0, 1731.0, 0.2465753424657534, 294.9898330479452, 0.4868899828767123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1217.4166666666667, 249, 3066, 1144.5, 1830.5, 2761.5, 3066.0, 0.09920675928719944, 0.03114743467854943, 0.04475929960027943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 142.10000000000002, 97, 299, 102.0, 299.0, 299.0, 299.0, 0.0666040588513464, 0.01795187523727696, 0.03922094481187684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 140.1, 96, 299, 102.0, 297.8, 299.0, 299.0, 0.06660317164303364, 0.01795163610691141, 0.03915538020420532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 245.4285714285714, 97, 1134, 104.5, 721.0, 1134.0, 1134.0, 0.11894243186297832, 7.674383742799735, 0.06919502523278734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 162.92857142857144, 95, 777, 101.0, 539.0, 777.0, 777.0, 0.11914995021234223, 2.5322522691682483, 0.06943210686899463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43c578cd-b2f6-4e38-8d56-e01cd1e6dee6", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 0.18838796923879042, 0.7189292231491137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 138.90000000000003, 97, 287, 101.0, 286.9, 287.0, 287.0, 0.06660184087488177, 0.017821195702849228, 0.03798386237395602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 146.57142857142856, 99, 303, 103.5, 301.5, 303.0, 303.0, 0.11894243186297832, 0.08839374086692041, 0.05970352536872154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 142.59999999999997, 99, 303, 103.5, 302.3, 303.0, 303.0, 0.06651280038843475, 0.04942992294492075, 0.03338630800747604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 130.0, 96, 308, 102.0, 303.5, 308.0, 308.0, 0.11894748468551135, 0.044588712520922016, 0.06712368520548179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a01b90c2-4d34-409e-ae03-6914908b1074", 3, 0, 0.0, 351.0, 246, 452, 355.0, 452.0, 452.0, 452.0, 0.017982161695597965, 0.02478986158231035, 0.01153152947276302], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 543.642857142857, 99, 979, 498.0, 977.5, 979.0, 979.0, 0.07549204637368563, 0.014107365529792398, 0.051379457063898626], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3c7d985-7d85-4760-a7ec-d8822045f252", 3, 0, 0.0, 449.3333333333333, 259, 637, 452.0, 637.0, 637.0, 637.0, 0.05061497190869059, 0.0331336941759039, 0.03245816883467463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 128.39999999999998, 102, 311, 106.0, 291.80000000000007, 311.0, 311.0, 0.06737318681910974, 0.0530300669689477, 0.023949062502105413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1727.0, 1038, 3282, 1741.5, 2113.8, 3108.7499999999973, 3282.0, 0.10086376056777129, 0.05220487607511599, 0.04639338987052761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 305.1, 200, 603, 209.5, 602.3, 603.0, 603.0, 0.06646726487205053, 0.10301127866400799, 0.14948643652376206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d5f99a3-ed71-4787-9bdc-b72d64af9b23", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f60b3374-5c21-4fe9-b327-6b00908e3e4b", 1, 0, 0.0, 2032.0, 2032, 2032, 2032.0, 2032.0, 2032.0, 2032.0, 0.4921259842519685, 0.08890947957677166, 0.3392977977362205], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1097.3157894736844, 508, 2604, 908.0, 1829.8, 1856.9999999999995, 2604.0, 0.26281087760390254, 94.84046612477293, 0.9520095306405209], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 169.31481481481478, 97, 423, 103.0, 407.0, 413.25, 423.0, 0.24812869608370208, 0.1844003298043919, 0.11994502398577396], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 617.6481481481479, 466, 1015, 586.0, 814.0, 905.5, 1015.0, 0.24774847107077808, 72.84627651826227, 0.12460006113422921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5031a40-4338-4e7a-b16a-5c273536972f", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 142.96296296296293, 96, 362, 101.5, 299.5, 311.0, 362.0, 0.24850551544185662, 0.43973827537172283, 0.12085522137699667], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 955.7407407407409, 670, 1370, 905.5, 1211.0, 1267.5, 1370.0, 0.24706269902272976, 222.30745087055286, 0.12401389384539364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 112.61538461538461, 104, 149, 106.0, 139.79999999999998, 149.0, 149.0, 0.13317625364954158, 0.09949202543154229, 0.04733999641448548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, 4.761904761904762, 172.8988095238095, 97, 1078, 107.0, 305.2, 368.04999999999916, 1066.27, 0.7237729248611691, 1.6193847014652094, 0.34731272375569217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 122.36363636363636, 100, 306, 104.0, 267.40000000000015, 306.0, 306.0, 0.05408089518630868, 0.041881005744866, 0.019224068210758165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa56ecc3-0812-49cb-8a1f-592077353942", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e111d904-46e8-4fdb-9d92-68815937cc09", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8187cb0-3ee9-430d-bf3d-309d0c7af084", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 112.07142857142857, 102, 135, 106.5, 132.0, 135.0, 135.0, 0.12586532410320955, 0.10214266047828822, 0.044741189427312776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa56ecc3-0812-49cb-8a1f-592077353942", 3, 0, 0.0, 335.0, 224, 485, 296.0, 485.0, 485.0, 485.0, 0.03943580508196075, 0.03287600807776741, 0.02528923698289801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e4f28c8-9787-4961-ab07-116b28d1bac1", 3, 0, 0.0, 347.0, 224, 511, 306.0, 511.0, 511.0, 511.0, 0.049914313761376304, 0.03209009429645775, 0.03200885355140343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffb1c2ec-7dcd-4c2c-a331-016f6469c3b5", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 251.36363636363637, 195, 493, 207.0, 472.80000000000007, 493.0, 493.0, 0.050707134032784464, 0.07858615401370014, 0.11404153288818616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2162cbb6-1add-4983-afef-83862103ddcd", 3, 0, 0.0, 345.0, 206, 575, 254.0, 575.0, 575.0, 575.0, 0.11624752973999303, 0.05259897992792653, 0.07454675572519084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 393.85714285714283, 202, 1236, 219.5, 920.5, 1236.0, 1236.0, 0.11863602467629314, 10.308581767231884, 0.26464704723408583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 107.53333333333333, 99, 121, 105.0, 118.0, 121.0, 121.0, 0.07742934572202864, 0.06419679152148665, 0.027523712737127372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 128.38888888888889, 102, 305, 107.0, 296.90000000000003, 305.0, 305.0, 0.0907765937596135, 0.07047596878798118, 0.03226824231298761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 103.46153846153847, 99, 116, 103.0, 113.6, 116.0, 116.0, 0.13034410844629823, 0.09686705715589156, 0.06542663255995829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 160.92307692307693, 97, 304, 100.0, 302.4, 304.0, 304.0, 0.13034280156812417, 0.04993601923057642, 0.07349407065582482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 190.15384615384616, 97, 878, 101.0, 645.9999999999998, 878.0, 878.0, 0.13034933622107248, 9.054627730442586, 0.07576946842538002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 212.92307692307693, 95, 783, 101.0, 591.7999999999998, 783.0, 783.0, 0.13034410844629823, 2.9805444185148793, 0.07589371879261249], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5511811023622047], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07874015748031496], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07874015748031496], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.7874015748031497], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1270, 19, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
