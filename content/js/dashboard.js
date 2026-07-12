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

    var data = {"OkPercent": 97.79131759329779, "KoPercent": 2.208682406702209};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8086984957488554, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36363636363636365, 500, 1500, "see books"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8fff8dbd-d54e-494b-b202-9526d9ef7287"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6957113-8e26-4735-83ee-2cdb5a472508"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d5a031c2-2c74-4a92-a60a-17d733c3e466"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4b42488f-bcae-4226-a8a8-ba91ee379001"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d11c4a42-9201-41b5-936b-ab28472c7c0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df01296c-aa05-4980-a192-9e6899b1a4dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab3c2d53-41a1-4b1e-b7cc-00cc3ca128b8"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e9163c2-6b3a-41f1-a111-e13324da4fbe"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/174a14e6-e6ce-42e0-8c3f-062f3c046d85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f4e1960-6a8a-4fb0-a2b2-e5e3eda04248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8532aa43-2145-4cff-902d-7aa36c0d94ce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b1364aa-3db1-40d8-9dce-ce7e1658c4a8"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29c7597f-5fb3-42cb-a2b2-49a34720e3c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5a031c2-2c74-4a92-a60a-17d733c3e466"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a1a9620-4a83-40bc-87cd-e0dfec350a42"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fff8dbd-d54e-494b-b202-9526d9ef7287"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6957113-8e26-4735-83ee-2cdb5a472508"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df01296c-aa05-4980-a192-9e6899b1a4dc"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8272727272727273, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9114285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5315d5b-5a56-48d1-882c-a847103c9c29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f4e1960-6a8a-4fb0-a2b2-e5e3eda04248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e9163c2-6b3a-41f1-a111-e13324da4fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d11c4a42-9201-41b5-936b-ab28472c7c0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab3c2d53-41a1-4b1e-b7cc-00cc3ca128b8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b42488f-bcae-4226-a8a8-ba91ee379001"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=174a14e6-e6ce-42e0-8c3f-062f3c046d85"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b1364aa-3db1-40d8-9dce-ce7e1658c4a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8532aa43-2145-4cff-902d-7aa36c0d94ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 29, 2.208682406702209, 302.1393754760092, 76, 3091, 92.0, 842.6000000000001, 1019.1999999999998, 1508.9599999999964, 5.160047945609243, 717.9934466248943, 3.7759853780629187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1360.2181818181818, 952, 2005, 1368.0, 1597.4, 1757.6, 2005.0, 0.24175399113861734, 290.91051438243943, 1.1887024857255257], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 515.8571428571429, 86, 931, 473.0, 856.5, 931.0, 931.0, 0.08659668829522048, 0.017058387817083052, 0.05826671702676456], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 515.8571428571429, 86, 931, 473.0, 856.5, 931.0, 931.0, 0.08834646961196968, 0.017403071301911436, 0.05944406011977257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 137.0, 78, 249, 81.0, 246.0, 249.0, 249.0, 0.10338283401885998, 0.06093645001809199, 0.05709997766192336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 92.00000000000001, 79, 238, 81.0, 160.5, 238.0, 238.0, 0.10338130718278553, 0.07682927223251933, 0.05189257020698415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 256.2857142857143, 79, 624, 233.5, 616.0, 624.0, 624.0, 0.10338359745380969, 6.535796224467943, 0.05897538085778847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 270.57142857142856, 78, 855, 83.0, 851.0, 855.0, 855.0, 0.10338436090003471, 19.955914820055828, 0.05887485507727981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fff8dbd-d54e-494b-b202-9526d9ef7287", 3, 0, 0.0, 450.66666666666663, 188, 814, 350.0, 814.0, 814.0, 814.0, 0.023046076789527865, 0.02311359459262218, 0.01477889689953447], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 190.85714285714286, 78, 350, 186.0, 307.5, 350.0, 350.0, 0.08665994020464125, 0.16042002602893204, 0.05601220744532687], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 91.5, 78, 234, 80.5, 158.5, 234.0, 234.0, 0.11180233347441723, 0.08308747634182764, 0.05611953066977583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 118.92857142857142, 77, 317, 80.0, 278.0, 317.0, 317.0, 0.11180501205896916, 0.029916575492341356, 0.06376379593988085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 553.1428571428571, 459, 629, 612.0, 629.0, 629.0, 629.0, 0.08255495801490706, 24.273898738973017, 0.04708212449287669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 822.7142857142858, 694, 926, 843.0, 926.0, 926.0, 926.0, 0.08249172136653429, 74.22619589058651, 0.04696550152020458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 168.2857142857143, 78, 239, 234.0, 239.0, 239.0, 239.0, 0.08294035403682552, 0.14676554835422642, 0.04592498119031257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 112.00000000000001, 79, 243, 82.0, 239.4, 243.0, 243.0, 0.0859933957072097, 0.06390720130194001, 0.04316465370459549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 101.53333333333333, 77, 234, 81.0, 234.0, 234.0, 234.0, 0.08599487470546756, 0.023010347333298934, 0.049043951980461964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 121.0, 77, 237, 80.0, 235.2, 237.0, 237.0, 0.08599438170039558, 0.023178173192684743, 0.050555290804334116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 153.06666666666666, 80, 238, 87.0, 238.0, 238.0, 238.0, 0.08599438170039558, 0.023178173192684743, 0.05063926969271341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 102.14285714285714, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.08309493002219821, 0.061753165768450045, 0.046659750744886694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6957113-8e26-4735-83ee-2cdb5a472508", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 690.6153846153846, 78, 1000, 854.0, 977.6, 1000.0, 1000.0, 0.06826942265074414, 47.25728209910095, 0.03562195085126719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 90.71428571428572, 78, 238, 79.5, 159.5, 238.0, 238.0, 0.11180501205896916, 0.03013494465651903, 0.06572911841747991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5a031c2-2c74-4a92-a60a-17d733c3e466", 3, 0, 0.0, 854.0, 184, 1981, 397.0, 1981.0, 1981.0, 1981.0, 0.04403734366742998, 0.028311768796606192, 0.02824009343256415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 451.99999999999994, 77, 632, 511.0, 629.6, 632.0, 632.0, 0.06826870562534133, 15.44522027160442, 0.035688245376108055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 79.5, 76, 84, 80.0, 82.5, 84.0, 84.0, 0.11180679785330948, 0.030135425983899823, 0.0658393545952594], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 472.2857142857142, 80, 742, 475.0, 737.0, 742.0, 742.0, 0.08851571786247187, 0.01743641094054273, 0.060125980785766676], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 276.66666666666663, 159, 477, 314.0, 474.6, 477.0, 477.0, 0.08595397451178143, 0.13321187260761438, 0.19331250322327403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b42488f-bcae-4226-a8a8-ba91ee379001", 3, 0, 0.0, 671.6666666666666, 188, 1183, 644.0, 1183.0, 1183.0, 1183.0, 0.026764684890443223, 0.026843097053208195, 0.017163551182999073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 571.1818181818182, 139, 1321, 535.5, 1114.3999999999999, 1295.9499999999996, 1321.0, 0.09505867712888229, 0.05839053507233101, 0.04298063233464111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 81.61538461538461, 78, 89, 81.0, 89.0, 89.0, 89.0, 0.06826834711828804, 0.0507345821845871, 0.034267510174609425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 165.0, 79, 247, 231.0, 243.8, 247.0, 247.0, 0.06826942265074414, 0.09714238310174245, 0.03452447064939976], "isController": false}, {"data": ["login", 22, 0, 0.0, 2739.272727272727, 1387, 4772, 2572.5, 4333.4, 4710.349999999999, 4772.0, 0.09804620650313749, 37.45420361272417, 0.19966121136088136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d11c4a42-9201-41b5-936b-ab28472c7c0c", 3, 0, 0.0, 297.6666666666667, 193, 487, 213.0, 487.0, 487.0, 487.0, 0.025524963414219108, 0.02127911175254399, 0.016368547501956914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 96.50000000000001, 82, 238, 84.0, 166.5, 238.0, 238.0, 0.10060289880066972, 0.08144512022046406, 0.03576118668305057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df01296c-aa05-4980-a192-9e6899b1a4dc", 3, 0, 0.0, 429.6666666666667, 265, 585, 439.0, 585.0, 585.0, 585.0, 0.03532237554749682, 0.029446811125370884, 0.02265139317336222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab3c2d53-41a1-4b1e-b7cc-00cc3ca128b8", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 773.7692307692308, 159, 1082, 935.0, 1063.2, 1082.0, 1082.0, 0.0682393205463345, 62.82282960412008, 0.1400413159559279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e9163c2-6b3a-41f1-a111-e13324da4fbe", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 436.78571428571433, 159, 934, 319.5, 930.5, 934.0, 934.0, 0.10332027069910922, 26.613019980018596, 0.2267049689670187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 617.8181818181819, 78, 1088, 842.0, 1072.0, 1088.0, 1088.0, 0.10354013121358446, 78.83643394845583, 0.17351980263839079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/174a14e6-e6ce-42e0-8c3f-062f3c046d85", 3, 0, 0.0, 1187.0, 180, 2958, 423.0, 2958.0, 2958.0, 2958.0, 0.047160913035276364, 0.030319922931207947, 0.030243163632647927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f4e1960-6a8a-4fb0-a2b2-e5e3eda04248", 3, 0, 0.0, 268.0, 186, 417, 201.0, 417.0, 417.0, 417.0, 0.05082850462539392, 0.03221455029480533, 0.03259510225000847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8532aa43-2145-4cff-902d-7aa36c0d94ce", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b1364aa-3db1-40d8-9dce-ce7e1658c4a8", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1027.3478260869563, 171, 1849, 1127.0, 1780.0, 1836.3999999999999, 1849.0, 0.09878282381439137, 0.030970294286916857, 0.044568031838133605], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 85.13333333333334, 80, 93, 86.0, 90.0, 93.0, 93.0, 0.06685355950635333, 0.05190290996831141, 0.023764351230774028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 212.00000000000003, 158, 552, 163.0, 436.0, 552.0, 552.0, 0.11173095186790209, 0.17316115294371154, 0.2512855294450962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 243.95238095238093, 158, 780, 163.0, 446.4000000000001, 749.3999999999996, 780.0, 0.11661678059941025, 6.815660800657497, 0.2608530396025034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29c7597f-5fb3-42cb-a2b2-49a34720e3c9", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 81.27272727272728, 78, 89, 81.0, 87.60000000000001, 89.0, 89.0, 0.058125710058389915, 0.04319693882269016, 0.02917638180665275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5a031c2-2c74-4a92-a60a-17d733c3e466", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 80.00000000000001, 77, 83, 80.0, 82.8, 83.0, 83.0, 0.058126631508861666, 0.015553415071707127, 0.03315034453239767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 80.27272727272727, 78, 83, 80.0, 82.8, 83.0, 83.0, 0.058126631508861666, 0.01566694364887287, 0.03417210172688938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 94.63636363636364, 78, 235, 81.0, 204.4000000000001, 235.0, 235.0, 0.05812601720530109, 0.01566677807486631, 0.03422850427226226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 82.0, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.0751455945895172, 0.022162079654330265, 0.04645230603043397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a1a9620-4a83-40bc-87cd-e0dfec350a42", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 943.9272727272726, 615, 1665, 923.0, 1260.0, 1421.9999999999998, 1665.0, 0.23857548745309823, 285.41922525321536, 0.4710933941700826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1027.3478260869563, 171, 1849, 1127.0, 1780.0, 1836.3999999999999, 1849.0, 0.09676225094238018, 0.030336806256731286, 0.04365640618689418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 167.33333333333334, 79, 319, 158.5, 304.30000000000007, 319.0, 319.0, 0.05491764641273357, 0.014802021884682097, 0.03233919998718589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 138.83333333333334, 78, 315, 83.0, 291.30000000000007, 315.0, 315.0, 0.05491764641273357, 0.014802021884682097, 0.032285569473110946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 89.86666666666667, 77, 237, 79.0, 143.40000000000006, 237.0, 237.0, 0.06678866729893272, 0.018001632982915457, 0.039264431361286614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 90.73333333333333, 78, 237, 80.0, 145.20000000000005, 237.0, 237.0, 0.06678896468199547, 0.018001713136944094, 0.03932982978832351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fff8dbd-d54e-494b-b202-9526d9ef7287", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 80.39999999999998, 78, 87, 80.0, 84.6, 87.0, 87.0, 0.06678599097053402, 0.049632948367750375, 0.03352343687388133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 92.91666666666666, 77, 234, 81.0, 188.70000000000016, 234.0, 234.0, 0.0549568817465297, 0.014705259373583142, 0.03134259662106772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 90.13333333333334, 78, 236, 80.0, 143.00000000000006, 236.0, 236.0, 0.06678866729893272, 0.017871186367097232, 0.038090411818922566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 120.0, 78, 244, 81.5, 242.20000000000002, 244.0, 244.0, 0.054955371658598914, 0.04084085725800173, 0.027585020539570158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 109.91666666666667, 81, 250, 83.0, 247.0, 250.0, 250.0, 0.056908448533421856, 0.04479317335736134, 0.0202291750646148], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 453.5714285714285, 79, 814, 437.5, 729.0, 814.0, 814.0, 0.08945001022285831, 0.017271039920261706, 0.06087292827387037], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1458.181818181818, 969, 3091, 1390.5, 2279.1999999999994, 3006.849999999999, 3091.0, 0.09783343413141699, 0.0506364454000498, 0.044999558081931054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 289.0833333333333, 163, 564, 239.0, 537.3000000000001, 564.0, 564.0, 0.05489629175549191, 0.08507853028902898, 0.12346304678993934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6957113-8e26-4735-83ee-2cdb5a472508", 3, 0, 0.0, 332.6666666666667, 230, 519, 249.0, 519.0, 519.0, 519.0, 0.025223437618234864, 0.025297334408132036, 0.01617518623304775], "isController": false}, {"data": ["addBook", 60, 14, 23.333333333333332, 836.5333333333334, 406, 3678, 696.5, 1413.1, 1558.3999999999996, 3678.0, 0.2784145221014728, 78.83444044191344, 1.0127645445486437], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df01296c-aa05-4980-a192-9e6899b1a4dc", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 161.2909090909091, 79, 599, 81.0, 324.2, 429.99999999999994, 599.0, 0.23936772104521004, 0.17788948800332505, 0.1157099823411904], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 512.5454545454546, 386, 713, 469.0, 657.5999999999999, 697.2, 713.0, 0.23937918097501318, 70.38542734352218, 0.12039089668176932], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 127.7090909090909, 77, 332, 84.0, 237.8, 257.79999999999967, 332.0, 0.23978097098214285, 0.42429992130824495, 0.11661223002842494], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 781.1090909090912, 534, 1033, 772.0, 994.1999999999999, 1010.8, 1033.0, 0.23923132799485, 215.26076945358477, 0.12008291268491494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 87.38095238095238, 80, 122, 84.0, 98.0, 119.69999999999996, 122.0, 0.11908272279810375, 0.08896316693413024, 0.04233018661963844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, 8.0, 148.07999999999996, 80, 2566, 86.0, 245.0, 298.7999999999997, 1413.0800000000138, 0.697878449513479, 1.5056610715923593, 0.33559307829199236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 101.0909090909091, 81, 244, 85.0, 217.0000000000001, 244.0, 244.0, 0.058458398877598745, 0.04527100616204668, 0.020780133976021426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5315d5b-5a56-48d1-882c-a847103c9c29", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 84.57142857142858, 79, 95, 84.0, 94.5, 95.0, 95.0, 0.10591056609197577, 0.0859489066625311, 0.03764789654050701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f4e1960-6a8a-4fb0-a2b2-e5e3eda04248", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e9163c2-6b3a-41f1-a111-e13324da4fbe", 3, 0, 0.0, 301.6666666666667, 178, 420, 307.0, 420.0, 420.0, 420.0, 0.052228412256267405, 0.03357783665564067, 0.03349282947423399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 177.54545454545453, 161, 314, 163.0, 285.80000000000007, 314.0, 314.0, 0.05810084193401857, 0.09004495717703855, 0.13067015524809059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 182.66666666666666, 159, 318, 161.0, 316.8, 318.0, 318.0, 0.06676221080835686, 0.1034683872586546, 0.15014977684731037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d11c4a42-9201-41b5-936b-ab28472c7c0c", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 93.86666666666666, 81, 236, 83.0, 149.60000000000005, 236.0, 236.0, 0.08581628449814638, 0.07115041556535769, 0.030505007380200466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 85.46153846153847, 80, 94, 83.0, 93.6, 94.0, 94.0, 0.06809206046574968, 0.05286444147487403, 0.02420459961868446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab3c2d53-41a1-4b1e-b7cc-00cc3ca128b8", 3, 0, 0.0, 258.0, 166, 423, 185.0, 423.0, 423.0, 423.0, 0.031108069433210973, 0.03140173284908439, 0.01994885963002136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b42488f-bcae-4226-a8a8-ba91ee379001", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=174a14e6-e6ce-42e0-8c3f-062f3c046d85", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b1364aa-3db1-40d8-9dce-ce7e1658c4a8", 3, 0, 0.0, 356.3333333333333, 186, 609, 274.0, 609.0, 609.0, 609.0, 0.019180236684120684, 0.02644150467358434, 0.012299826259022702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8532aa43-2145-4cff-902d-7aa36c0d94ce", 3, 0, 0.0, 295.0, 189, 452, 244.0, 452.0, 452.0, 452.0, 0.034832282559476124, 0.029038240766542434, 0.022337108281955717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 88.6190476190476, 77, 237, 80.0, 94.60000000000001, 222.9999999999998, 237.0, 0.11666796297736641, 0.08670343732985923, 0.05856184860387338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 117.04761904761904, 77, 239, 80.0, 238.0, 238.9, 239.0, 0.11666990749743048, 0.03956273090919192, 0.06607171379760549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 145.90476190476187, 77, 697, 80.0, 237.8, 651.0999999999993, 697.0, 0.11667055568518951, 5.029014204987388, 0.06811207943042547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 120.19047619047619, 77, 628, 79.0, 236.8, 588.8999999999994, 628.0, 0.11666990749743048, 1.663511920470013, 0.06822563647601322], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5331302361005331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.15232292460015232], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.15232292460015232], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.3709063214013708], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 29, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
