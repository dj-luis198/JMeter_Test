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

    var data = {"OkPercent": 98.50628930817611, "KoPercent": 1.4937106918238994};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7677245104659014, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3a4d228-0e55-4b74-a551-114a3ba458db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93fad036-c34e-47a8-a9fe-8813ae5e6f8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ab0d447-8ccb-4340-a853-7601949d7b1b"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d74bca1-c527-4bb8-a879-49b4ffd28ea1"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb0910b9-e073-409c-8e3a-d646d7c397ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c98cc675-a5b1-4ef9-a9b9-8370acaae852"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3266db89-88b6-4821-b691-20831033860c"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1717f78-13a0-4b5a-8a9a-b6a7984ffc17"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7356d4f7-b2f9-4482-a27c-6befc18dc888"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59a670e8-2fe2-41ef-b2fe-a63e15d1761b"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5194ad3-dcde-495f-b440-247544f51d5a"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=321b5d45-8950-4367-8db0-897fc4fd8950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59a670e8-2fe2-41ef-b2fe-a63e15d1761b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93fad036-c34e-47a8-a9fe-8813ae5e6f8b"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe587a65-da84-4154-b199-b0cbab6b1977"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb0910b9-e073-409c-8e3a-d646d7c397ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be4accbb-034a-404e-88be-7c89bdf1772f"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ab0d447-8ccb-4340-a853-7601949d7b1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/291eff6b-b100-44ab-8248-cf1d56a363dc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9491017964071856, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3a4d228-0e55-4b74-a551-114a3ba458db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/426d0275-fd7f-4844-8724-505cc112dc80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b46963ed-d3e9-47ba-a143-8cd30e2f13cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7356d4f7-b2f9-4482-a27c-6befc18dc888"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d74bca1-c527-4bb8-a879-49b4ffd28ea1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c98cc675-a5b1-4ef9-a9b9-8370acaae852"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/321b5d45-8950-4367-8db0-897fc4fd8950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5194ad3-dcde-495f-b440-247544f51d5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99262fbf-d987-4d9a-8199-a1b5986f51b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3266db89-88b6-4821-b691-20831033860c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 19, 1.4937106918238994, 406.1894654088049, 111, 2192, 133.0, 1134.0, 1358.35, 1758.4399999999987, 4.982393193862882, 724.8728183974966, 3.6299081236608837], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1908.0181818181813, 1401, 2407, 1854.0, 2302.4, 2332.7999999999997, 2407.0, 0.24237937219335703, 291.66348199451784, 1.1917774794858913], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 555.1538461538461, 119, 1062, 498.0, 1053.6, 1062.0, 1062.0, 0.08254702005257611, 0.01636430182682905, 0.05549848478594923], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 555.1538461538461, 119, 1062, 498.0, 1053.6, 1062.0, 1062.0, 0.08332425312626189, 0.01651838221155387, 0.05602103857271964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 130.0, 113, 347, 116.0, 187.40000000000015, 347.0, 347.0, 0.10114547247578831, 0.027064315877310546, 0.05768452727134802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 131.81250000000003, 111, 341, 117.0, 195.40000000000015, 341.0, 341.0, 0.10114355431092793, 0.07516625471739859, 0.050769323159977495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 137.4375, 111, 468, 115.0, 225.80000000000024, 468.0, 468.0, 0.10091899358533647, 0.02720082248979772, 0.059427883917927624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 186.74999999999997, 114, 347, 116.0, 346.3, 347.0, 347.0, 0.10100117413864936, 0.027222972717057838, 0.059377643390104415], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 232.46153846153848, 114, 400, 228.0, 364.0, 400.0, 400.0, 0.08232641791422854, 0.1584684594827368, 0.053210374078577406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3a4d228-0e55-4b74-a551-114a3ba458db", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93fad036-c34e-47a8-a9fe-8813ae5e6f8b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 133.07142857142856, 115, 342, 116.0, 236.0, 342.0, 342.0, 0.07286164094824221, 0.05414815308751203, 0.03657312836659814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 164.28571428571428, 113, 348, 115.0, 347.0, 348.0, 348.0, 0.072862020151553, 0.03512990257307019, 0.04067993926430177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 912.2, 836, 1017, 900.0, 1017.0, 1017.0, 1017.0, 0.026252369276327188, 7.719068227938822, 0.01497205435290535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1280.2, 1009, 1566, 1247.0, 1566.0, 1566.0, 1566.0, 0.026195977345718793, 23.571186463294197, 0.014914311320853569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 161.4, 114, 347, 115.0, 347.0, 347.0, 347.0, 0.026352405447569255, 0.04663140495214403, 0.014591615125753679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 132.28571428571428, 114, 342, 116.0, 230.0, 342.0, 342.0, 0.07067708648856041, 0.05252467072050241, 0.03547658442882817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 166.42857142857142, 113, 379, 115.0, 360.0, 379.0, 379.0, 0.0705965407695023, 0.018890090010589482, 0.040262089657606775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 164.28571428571428, 113, 342, 115.5, 342.0, 342.0, 342.0, 0.07067780010298765, 0.019049875809008392, 0.04155081607617048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 133.85714285714286, 113, 379, 114.0, 252.0, 379.0, 379.0, 0.07067780010298765, 0.019049875809008392, 0.04161983736533355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 116.2, 114, 119, 115.0, 119.0, 119.0, 119.0, 0.026351572134793562, 0.01958354140095498, 0.014797025368658494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 710.5882352941177, 114, 1621, 1018.0, 1417.7999999999997, 1621.0, 1621.0, 0.09428782189585078, 44.927437591514646, 0.051141177294383215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 285.2142857142857, 114, 1365, 115.0, 1190.0, 1365.0, 1365.0, 0.07286239935881088, 9.382792454708213, 0.0419406054344941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 564.6470588235294, 115, 1022, 686.0, 958.8, 1022.0, 1022.0, 0.09428677600235162, 14.689075923733093, 0.05123268693739913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 277.0, 114, 912, 117.5, 797.0, 912.0, 912.0, 0.07286164094824221, 3.0773675154180435, 0.04201132282911343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ab0d447-8ccb-4340-a853-7601949d7b1b", 3, 0, 0.0, 415.0, 246, 599, 400.0, 599.0, 599.0, 599.0, 0.01633728877247058, 0.02252227146855889, 0.01047671187557521], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 581.3846153846154, 116, 1217, 465.0, 1189.0, 1217.0, 1217.0, 0.08344245038383527, 0.01654181389445172, 0.0566144990885517], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 332.7142857142857, 231, 685, 233.5, 590.5, 685.0, 685.0, 0.07055491440176992, 0.10934633706602429, 0.15867965612038684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d74bca1-c527-4bb8-a879-49b4ffd28ea1", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 594.8695652173911, 213, 1736, 510.0, 1233.0000000000002, 1651.7999999999988, 1736.0, 0.0982540679320082, 0.06035332883714175, 0.04442542329347636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 130.88235294117646, 115, 351, 116.0, 168.59999999999985, 351.0, 351.0, 0.09428468428496159, 0.07006898900474197, 0.04732649191647486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 197.00000000000003, 113, 349, 117.0, 348.2, 349.0, 349.0, 0.09428729894620078, 0.10020192041042705, 0.04958099348308374], "isController": false}, {"data": ["login", 23, 0, 0.0, 2646.7826086956525, 1525, 4310, 2506.0, 3799.6000000000004, 4219.999999999999, 4310.0, 0.09657170449058426, 25.249379861388114, 0.18051839717212856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 119.28571428571429, 116, 129, 118.0, 127.0, 129.0, 129.0, 0.07111725202938159, 0.057574415949567706, 0.025279960682319233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb0910b9-e073-409c-8e3a-d646d7c397ab", 3, 0, 0.0, 354.3333333333333, 230, 514, 319.0, 514.0, 514.0, 514.0, 0.06869232706706661, 0.03041066562864928, 0.0440507435944405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c98cc675-a5b1-4ef9-a9b9-8370acaae852", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.18799590270551508, 0.7174330124869928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3266db89-88b6-4821-b691-20831033860c", 1, 0, 0.0, 1147.0, 1147, 1147, 1147.0, 1147.0, 1147.0, 1147.0, 0.8718395815170009, 0.15751008064516128, 0.6010925239755884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 877.235294117647, 231, 1739, 1134.0, 1537.3999999999999, 1739.0, 1739.0, 0.09422458707460371, 59.746853695543734, 0.19915011674149208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1717f78-13a0-4b5a-8a9a-b6a7984ffc17", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7356d4f7-b2f9-4482-a27c-6befc18dc888", 3, 0, 0.0, 375.6666666666667, 253, 572, 302.0, 572.0, 572.0, 572.0, 0.034000884022984595, 0.028345138015255063, 0.021803952319426972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59a670e8-2fe2-41ef-b2fe-a63e15d1761b", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 0.14845033894823334, 0.5665185907970419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 827.5555555555555, 114, 1682, 1124.0, 1682.0, 1682.0, 1682.0, 0.047123132745864944, 31.325409284042536, 0.07290893552770054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 342.75, 230, 811, 235.5, 573.0000000000002, 811.0, 811.0, 0.10084393770365749, 0.15628840735908636, 0.2268003794253156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5194ad3-dcde-495f-b440-247544f51d5a", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1073.8695652173915, 155, 1728, 1026.0, 1564.8, 1697.5999999999995, 1728.0, 0.09637584905027886, 0.030510289169449693, 0.04348207252073128], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=321b5d45-8950-4367-8db0-897fc4fd8950", 1, 0, 0.0, 1091.0, 1091, 1091, 1091.0, 1091.0, 1091.0, 1091.0, 0.9165902841429882, 0.16559492438130155, 0.6319460357470211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 138.07692307692307, 116, 358, 120.0, 265.5999999999999, 358.0, 358.0, 0.06756791875217646, 0.05245751504685575, 0.02401828361893773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 484.2142857142858, 231, 1483, 344.0, 1307.5, 1483.0, 1483.0, 0.07281730139081045, 12.54170334621506, 0.16110624759442843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 489.1764705882353, 232, 1352, 458.0, 1351.2, 1352.0, 1352.0, 0.09240335695960343, 13.131834493697548, 0.20503587254587555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 138.9, 115, 341, 116.5, 318.80000000000007, 341.0, 341.0, 0.053497105806575865, 0.03975712648320726, 0.0268530394380664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 160.3, 113, 345, 115.0, 344.6, 345.0, 345.0, 0.053433360584347236, 0.02232303872849975, 0.030024956718977928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 228.70000000000002, 114, 1254, 115.0, 1140.2000000000005, 1254.0, 1254.0, 0.053498250607205144, 4.82675949894876, 0.030991369394720792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59a670e8-2fe2-41ef-b2fe-a63e15d1761b", 3, 0, 0.0, 577.0, 310, 991, 430.0, 991.0, 991.0, 991.0, 0.047855285616296324, 0.03076633759511238, 0.030688448132846272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93fad036-c34e-47a8-a9fe-8813ae5e6f8b", 3, 0, 0.0, 288.6666666666667, 228, 407, 231.0, 407.0, 407.0, 407.0, 0.01949419073116211, 0.026874315672679543, 0.012501157467574664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 216.5, 113, 681, 115.5, 647.0000000000001, 681.0, 681.0, 0.05343393161525432, 1.58409690978215, 0.031006291177523553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 0.06811061163329248, 0.020087309290287427, 0.04210353238659583], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1293.6181818181822, 907, 1926, 1241.0, 1818.8, 1844.9999999999998, 1926.0, 0.2500693374071902, 299.1698657070824, 0.4937892580442759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1073.8695652173915, 155, 1728, 1026.0, 1564.8, 1697.5999999999995, 1728.0, 0.09718460426851684, 0.03076632173174514, 0.04384696012895974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 162.6, 114, 341, 116.5, 341.0, 341.0, 341.0, 0.047610659074353565, 0.012832560453634359, 0.028036354904135936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 162.5, 114, 341, 118.0, 341.0, 341.0, 341.0, 0.04755948502589614, 0.012818767448386068, 0.027959775376552223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 403.15384615384613, 113, 1249, 119.0, 1246.2, 1249.0, 1249.0, 0.0679181012188687, 14.117041623020578, 0.03858148147664401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 307.53846153846155, 114, 910, 116.0, 907.6, 910.0, 910.0, 0.0680407407019711, 4.630930911824434, 0.03871759396164596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 185.79999999999998, 114, 341, 122.5, 340.9, 341.0, 341.0, 0.047559711217433485, 0.012725938353102319, 0.027123897803692537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 169.6153846153846, 115, 344, 117.0, 343.2, 344.0, 344.0, 0.06832216528708449, 0.050774577913546184, 0.034294524372618575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 142.2, 116, 347, 117.5, 325.30000000000007, 347.0, 347.0, 0.04760997905160922, 0.035382025447533806, 0.023897977766139784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 151.07692307692307, 114, 349, 115.0, 344.2, 349.0, 349.0, 0.06832288343590526, 0.041962732494888924, 0.037641227998717636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 120.6, 117, 131, 118.0, 130.4, 131.0, 131.0, 0.048275129618723024, 0.037997807102237074, 0.017160299981655452], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 483.3076923076923, 116, 937, 504.0, 832.9999999999999, 937.0, 937.0, 0.08305435588152615, 0.01611548987695178, 0.056519637164268735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe587a65-da84-4154-b199-b0cbab6b1977", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1458.4347826086955, 1031, 2192, 1339.0, 1922.2, 2138.5999999999995, 2192.0, 0.09708860812927138, 0.05025093975440804, 0.04465696721570978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 352.1, 232, 688, 259.0, 665.1000000000001, 688.0, 688.0, 0.0475328095217724, 0.0736665710068875, 0.1069024026646893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb0910b9-e073-409c-8e3a-d646d7c397ab", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be4accbb-034a-404e-88be-7c89bdf1772f", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 1210.642857142857, 588, 2312, 945.5, 2136.8000000000006, 2262.7, 2312.0, 0.2650147414449929, 97.28857809386965, 0.9603364474537289], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ab0d447-8ccb-4340-a853-7601949d7b1b", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.26685976735598227, 1.0183945716395864], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 193.05454545454535, 114, 473, 117.0, 462.4, 465.2, 473.0, 0.25136192460970347, 0.18680314905076598, 0.12150796160332347], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 746.6363636363639, 561, 1035, 682.0, 1019.2, 1026.6, 1035.0, 0.25091011943321684, 73.77590611342507, 0.12619014795713543], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 182.4363636363637, 114, 471, 120.0, 346.4, 352.2, 471.0, 0.25154126191390885, 0.4451101236210966, 0.12233159026672522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/291eff6b-b100-44ab-8248-cf1d56a363dc", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1098.890909090909, 789, 1479, 1124.0, 1361.2, 1464.0, 1479.0, 0.250648267564747, 225.53375174741717, 0.1258136811799609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 122.17647058823526, 116, 143, 120.0, 135.0, 143.0, 143.0, 0.09491056075392483, 0.07090486228198485, 0.033737738392996715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 6, 3.592814371257485, 185.88622754491027, 115, 658, 123.0, 351.4000000000001, 439.4, 642.3599999999999, 0.7324015314647592, 1.627551344855866, 0.35089386153225416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 187.9, 116, 353, 121.5, 352.3, 353.0, 353.0, 0.056638611674350636, 0.043861737361093805, 0.02013325649361683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3a4d228-0e55-4b74-a551-114a3ba458db", 3, 0, 0.0, 345.0, 229, 456, 350.0, 456.0, 456.0, 456.0, 0.0675371454299865, 0.030558799527239982, 0.04330995328680774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/426d0275-fd7f-4844-8724-505cc112dc80", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 152.8125, 117, 346, 123.5, 343.9, 346.0, 346.0, 0.10259764410159732, 0.08326039282072985, 0.03647025630173967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b46963ed-d3e9-47ba-a143-8cd30e2f13cb", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7356d4f7-b2f9-4482-a27c-6befc18dc888", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 414.0, 230, 1369, 235.0, 1300.4, 1369.0, 1369.0, 0.05339940619860307, 6.462908230116731, 0.11873024221970652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 583.4615384615385, 232, 1587, 238.0, 1538.6, 1587.0, 1587.0, 0.06787625636339903, 18.82021154222686, 0.14864757375016316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d74bca1-c527-4bb8-a879-49b4ffd28ea1", 3, 0, 0.0, 371.3333333333333, 209, 516, 389.0, 516.0, 516.0, 516.0, 0.01797752808988764, 0.024783473782771535, 0.011528558052434457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c98cc675-a5b1-4ef9-a9b9-8370acaae852", 3, 0, 0.0, 706.3333333333334, 207, 1408, 504.0, 1408.0, 1408.0, 1408.0, 0.022307652268316443, 0.022373006718321275, 0.014305362945502406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/321b5d45-8950-4367-8db0-897fc4fd8950", 3, 0, 0.0, 402.33333333333337, 227, 677, 303.0, 677.0, 677.0, 677.0, 0.03564342319436359, 0.023332983087195693, 0.022857273337531337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 142.57142857142858, 118, 344, 120.5, 250.0, 344.0, 344.0, 0.0725230778794252, 0.06012899718714062, 0.025779687839951927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5194ad3-dcde-495f-b440-247544f51d5a", 3, 0, 0.0, 285.6666666666667, 208, 437, 212.0, 437.0, 437.0, 437.0, 0.0768974444415964, 0.034794091072206705, 0.04931248878578935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 122.41176470588235, 116, 144, 120.0, 136.0, 144.0, 144.0, 0.09210497800316407, 0.07150728272706586, 0.03274044139956223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99262fbf-d987-4d9a-8199-a1b5986f51b4", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 133.23529411764704, 114, 342, 117.0, 181.19999999999987, 342.0, 342.0, 0.09246165560752746, 0.06871417960676601, 0.04641141697487218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 182.2941176470588, 112, 346, 117.0, 345.2, 346.0, 346.0, 0.09246266140173394, 0.04107917183369775, 0.05181903289495154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3266db89-88b6-4821-b691-20831033860c", 3, 0, 0.0, 507.0, 239, 937, 345.0, 937.0, 937.0, 937.0, 0.01768805348867375, 0.02438440967595486, 0.011342924926004977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 327.11764705882354, 113, 1236, 116.0, 1235.2, 1236.0, 1236.0, 0.09246215850189547, 9.809943948215752, 0.053422816533321725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 261.6470588235294, 114, 679, 117.0, 678.2, 679.0, 679.0, 0.09246215850189547, 3.220453581276957, 0.05351311160998373], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 26.31578947368421, 0.39308176100628933], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15723270440251572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.526315789473685, 0.15723270440251572], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.7861635220125787], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 19, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
