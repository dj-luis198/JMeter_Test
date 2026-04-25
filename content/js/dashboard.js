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

    var data = {"OkPercent": 99.80334316617503, "KoPercent": 0.19665683382497542};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7431856899488927, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54e1a774-3598-45ed-9c22-ce5cda9c1596"], "isController": false}, {"data": [0.17, 500, 1500, "see books"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/2b81ab59-0c48-4037-9b65-030e703b64f4"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97c6681e-49a5-4ed0-be04-f169b508f086"], "isController": false}, {"data": [0.49, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54e1a774-3598-45ed-9c22-ce5cda9c1596"], "isController": false}, {"data": [0.14705882352941177, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/b4940b35-93f5-42ab-853c-a9956a3119d3"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=873f70f3-b845-4b6b-b1ec-826e9b29f598"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b81ab59-0c48-4037-9b65-030e703b64f4"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97c6681e-49a5-4ed0-be04-f169b508f086"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f9315f76-d8d8-4589-8c29-83246f88e640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7346153846153847, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80eb6068-147c-49e6-a7e3-d738efb9bc1d"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6469724c-f706-4168-8116-c6f2fe1e0966"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c2efdcf-2eca-4b15-9ae0-0190442c9798"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36a94f63-4119-47fb-9fd8-df2f99888980"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8d81385d-048f-4210-a0d0-ed3a562d47ae"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b92f727-d29d-43f7-8cc5-dbf07068f101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b92f727-d29d-43f7-8cc5-dbf07068f101"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4940b35-93f5-42ab-853c-a9956a3119d3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/873f70f3-b845-4b6b-b1ec-826e9b29f598"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/303ade20-fc08-447c-b087-6e61d9ea8f5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c2efdcf-2eca-4b15-9ae0-0190442c9798"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7d1f043-fca0-485c-a26f-3bfff857b0c5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7d1f043-fca0-485c-a26f-3bfff857b0c5"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/829d911b-82d4-40b3-850b-57e9bb7344fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80eb6068-147c-49e6-a7e3-d738efb9bc1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.14705882352941177, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1017, 2, 0.19665683382497542, 1490.4070796460162, 81, 56693, 176.0, 1230.6000000000006, 8272.099999999986, 33988.95999999993, 4.043303502208511, 592.4484265729922, 2.9542095940495456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54e1a774-3598-45ed-9c22-ce5cda9c1596", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["see books", 50, 0, 0.0, 10436.779999999999, 983, 50749, 1732.0, 40224.9, 44518.75, 50749.0, 0.20974650037964118, 252.394993691874, 1.0313219037221613], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 366.28571428571433, 169, 1312, 335.0, 954.5, 1312.0, 1312.0, 0.08850956219377272, 7.690817873794847, 0.19744250829777144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 9, 0, 0.0, 4424.666666666667, 84, 38936, 91.0, 38936.0, 38936.0, 38936.0, 0.04700990864407754, 0.03649695055863441, 0.016710553463324434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b81ab59-0c48-4037-9b65-030e703b64f4", 3, 0, 0.0, 2772.666666666667, 483, 5243, 2592.0, 5243.0, 5243.0, 5243.0, 0.016926201760324982, 0.016975790242044684, 0.010854367665312569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 342.81818181818176, 168, 583, 335.0, 565.6, 583.0, 583.0, 0.05474543373314089, 0.08484472981884238, 0.123123763561937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 120.2, 83, 256, 87.5, 255.5, 256.0, 256.0, 0.08210652500554219, 0.06101861868087657, 0.041213626809422546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 86.30000000000001, 82, 94, 85.0, 93.9, 94.0, 94.0, 0.08210719915922228, 0.021970090400026274, 0.046826762020493955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 120.5, 84, 256, 89.0, 254.70000000000002, 256.0, 256.0, 0.08199073504693968, 0.022099065305620464, 0.04820158447095478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 120.0, 82, 251, 88.5, 250.5, 251.0, 251.0, 0.0819940964250574, 0.022099971302066253, 0.04828363295342736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97c6681e-49a5-4ed0-be04-f169b508f086", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books", 50, 0, 0.0, 984.1000000000001, 649, 1677, 981.0, 1352.5, 1434.1499999999999, 1677.0, 0.2232252476684123, 267.05500186393084, 0.4407826667827438], "isController": false}, {"data": ["deleteBook", 9, 0, 0.0, 8722.777777777777, 381, 56693, 861.0, 56693.0, 56693.0, 56693.0, 0.059988002399520096, 0.010837676214757048, 0.040773095380923816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 0, 0.0, 8722.777777777777, 381, 56693, 861.0, 56693.0, 56693.0, 56693.0, 0.060998752914384856, 0.011020282508946483, 0.04146008987149596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54e1a774-3598-45ed-9c22-ce5cda9c1596", 3, 0, 0.0, 653.3333333333334, 250, 1302, 408.0, 1302.0, 1302.0, 1302.0, 0.018965255651646182, 0.01581055329552926, 0.012161964073484044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 2, 11.764705882352942, 6651.470588235295, 381, 27610, 1695.0, 23358.799999999996, 27610.0, 27610.0, 0.06915629322268327, 0.0221357344805142, 0.0312013744813278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 110.66666666666667, 82, 242, 85.0, 242.0, 242.0, 242.0, 0.02978953692164855, 0.008029211123413087, 0.017542080823978592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 84.21428571428572, 82, 90, 84.0, 88.5, 90.0, 90.0, 0.09175153683824204, 0.03439402615574168, 0.05177664153329925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 110.66666666666667, 82, 244, 84.5, 244.0, 244.0, 244.0, 0.02978924111908249, 0.008029131395377703, 0.017512815579773106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 108.92857142857143, 83, 249, 85.5, 247.5, 249.0, 249.0, 0.09174853038514723, 0.06818421056943069, 0.0460534615409821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 177.78571428571428, 82, 729, 87.0, 492.5, 729.0, 729.0, 0.09165362784699081, 1.9478825352375466, 0.053409208079921965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 181.07142857142858, 82, 1104, 84.0, 679.5, 1104.0, 1104.0, 0.09164762796300054, 5.913272959776512, 0.0533162121380737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 9, 0, 0.0, 120.55555555555556, 82, 247, 85.0, 247.0, 247.0, 247.0, 0.0479266402892639, 0.01291772726546566, 0.028175622513805534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 9, 0, 0.0, 102.88888888888889, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.047927405955778976, 0.012917933636518554, 0.02822287674935032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 9, 0, 0.0, 103.55555555555556, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.04792459863148646, 0.03561583941265742, 0.024055902047445354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 112.16666666666667, 83, 247, 86.0, 247.0, 247.0, 247.0, 0.0297887974262479, 0.007970830561320238, 0.016988923532157005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 9, 0, 0.0, 102.0, 81, 245, 84.0, 245.0, 245.0, 245.0, 0.047927661183387205, 0.01282439371508603, 0.02733374426865052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 119.0, 84, 277, 87.5, 277.0, 277.0, 277.0, 0.029787910080228772, 0.022137304268607515, 0.014952134551989831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 6240.333333333334, 86, 28024, 94.0, 28024.0, 28024.0, 28024.0, 0.030817590680760575, 0.024256814539739286, 0.010954690437301613], "isController": false}, {"data": ["deleteAccount", 8, 0, 0.0, 2038.25, 408, 11959, 517.0, 11959.0, 11959.0, 11959.0, 0.05422846452102709, 0.00979713470350587, 0.036911366964019414], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b4940b35-93f5-42ab-853c-a9956a3119d3", 2, 0, 0.0, 396.0, 269, 523, 396.0, 523.0, 523.0, 523.0, 0.0101615689462453, 0.020094899527487043, 0.006316248666294076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 15, 0, 0.0, 2012.4, 816, 4697, 1442.0, 4305.8, 4697.0, 4697.0, 0.07417480529113611, 0.03839125664482631, 0.034117512980590924], "isController": false}, {"data": ["goToProfile", 9, 0, 0.0, 947.6666666666666, 186, 5243, 367.0, 5243.0, 5243.0, 5243.0, 0.060116224701088766, 0.13690530859662012, 0.03886419995324293], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=873f70f3-b845-4b6b-b1ec-826e9b29f598", 1, 0, 0.0, 10948.0, 10948, 10948, 10948.0, 10948.0, 10948.0, 10948.0, 0.09134088417975886, 0.016502015208257215, 0.0629752580379978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 259.1666666666667, 169, 524, 179.5, 524.0, 524.0, 524.0, 0.02977490174282425, 0.04614528229088094, 0.06696445186887133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 115.42857142857142, 83, 352, 85.0, 300.0, 352.0, 352.0, 0.08864686886595327, 0.0658791671943266, 0.044496572848730445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 132.57142857142856, 82, 257, 86.0, 256.0, 257.0, 257.0, 0.08855883152947427, 0.033197207075850645, 0.049974954455458076], "isController": false}, {"data": ["addBook", 40, 0, 0.0, 13934.0, 543, 59139, 1425.5, 53947.7, 58804.499999999985, 59139.0, 0.22080294992741104, 80.05905271394425, 0.8018122747119901], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 84.0, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.044911860473820134, 0.03337688068415734, 0.022543648714397995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 83.83333333333333, 81, 88, 83.0, 88.0, 88.0, 88.0, 0.0449128690340739, 0.012017701284508053, 0.025614370620995267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 83.0, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.04491253284228964, 0.012105331117648381, 0.026403657002986684], "isController": false}, {"data": ["https://demoqa.com/books-0", 50, 0, 0.0, 179.0, 82, 443, 89.0, 351.0, 360.34999999999997, 443.0, 0.22379174835065482, 0.1663139848582503, 0.10818058147809974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 83.83333333333333, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.04491253284228964, 0.012105331117648381, 0.026447516898340483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b81ab59-0c48-4037-9b65-030e703b64f4", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books-3", 50, 0, 0.0, 560.6199999999999, 404, 769, 569.0, 680.5, 732.65, 769.0, 0.22361059556446022, 65.74893966650716, 0.11246040694892287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97c6681e-49a5-4ed0-be04-f169b508f086", 3, 0, 0.0, 341.0, 186, 556, 281.0, 556.0, 556.0, 556.0, 0.0780579189758801, 0.035319175578279086, 0.05005667330158978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9315f76-d8d8-4589-8c29-83246f88e640", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.5036844440063092, 0.941135153785489], "isController": false}, {"data": ["https://demoqa.com/books-1", 50, 0, 0.0, 133.41999999999996, 81, 340, 87.5, 268.5, 319.39999999999986, 340.0, 0.22409566195617586, 0.3965442768208893, 0.10898402309978084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 213.35714285714283, 82, 1064, 86.5, 698.0, 1064.0, 1064.0, 0.08855883152947427, 5.713978151666488, 0.051519297918234896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 509.9500000000002, 83, 1217, 412.5, 985.5, 1205.4499999999998, 1217.0, 0.10423615743829219, 46.909986296202675, 0.05680056235406938], "isController": false}, {"data": ["https://demoqa.com/books-2", 50, 0, 0.0, 803.26, 562, 1333, 802.5, 1015.9, 1079.7999999999997, 1333.0, 0.2236155958461167, 201.20970621662536, 0.11224454713369529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 134.14285714285714, 82, 619, 84.0, 433.0, 619.0, 619.0, 0.08864911414206654, 1.8840286550346366, 0.0516583914301635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 6833.90909090909, 85, 38956, 99.0, 37365.00000000001, 38956.0, 38956.0, 0.05515941069691408, 0.04120795818665945, 0.019607446771168678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 370.6, 81, 739, 368.5, 724.5000000000001, 738.6, 739.0, 0.10423670069994945, 15.338573019111799, 0.05690265204225756], "isController": false}, {"data": ["deleteBooks", 9, 0, 0.0, 2223.6666666666665, 196, 10948, 720.0, 10948.0, 10948.0, 10948.0, 0.059908938413611314, 0.010823392193865324, 0.04130440480469686], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 130, 0, 0.0, 4675.061538461536, 84, 46131, 175.5, 15320.600000000002, 34739.29999999996, 46106.51, 0.5860396343112683, 1.3732486430928468, 0.2751639220477126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 7431.9, 86, 34201, 3517.0, 32248.600000000006, 34201.0, 34201.0, 0.07265118712039756, 0.05626210096335474, 0.025825226671703814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 169.33333333333334, 167, 172, 169.0, 172.0, 172.0, 172.0, 0.044883974924819346, 0.06956139473211748, 0.10094511157408101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80eb6068-147c-49e6-a7e3-d738efb9bc1d", 3, 0, 0.0, 303.0, 204, 474, 231.0, 474.0, 474.0, 474.0, 0.017221090095003014, 0.017271542507390717, 0.011043472489308573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 4499.357142857143, 85, 14234, 569.5, 13404.0, 14234.0, 14234.0, 0.09342613662905153, 0.07581749954955255, 0.03321007200485816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6469724c-f706-4168-8116-c6f2fe1e0966", 1, 0, 0.0, 9703.0, 9703, 9703, 9703.0, 9703.0, 9703.0, 9703.0, 0.10306090899721736, 0.03291105199422859, 0.061494350973925596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 15, 0, 0.0, 589.2, 197, 1342, 453.0, 1297.0, 1342.0, 1342.0, 0.07222858903858932, 0.04436697510280536, 0.03265804367662779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 86.45, 83, 97, 84.5, 92.9, 96.8, 97.0, 0.10423452768729641, 0.07746335504885994, 0.05232084690553746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 126.50000000000003, 81, 254, 86.0, 250.9, 253.85, 254.0, 0.10423561418229767, 0.10616967342982077, 0.05506979225842094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c2efdcf-2eca-4b15-9ae0-0190442c9798", 3, 0, 0.0, 516.6666666666666, 220, 779, 551.0, 779.0, 779.0, 779.0, 0.04243821702904189, 0.02728368445063728, 0.027214611831774906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36a94f63-4119-47fb-9fd8-df2f99888980", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["login", 15, 0, 0.0, 3888.4666666666676, 1587, 11199, 2791.0, 7944.600000000002, 11199.0, 11199.0, 0.0737764181057167, 0.10706226299325683, 0.1113130527083323], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 242.3, 169, 507, 177.0, 506.6, 507.0, 507.0, 0.08193430507419151, 0.12698217007103704, 0.18427217244713187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d81385d-048f-4210-a0d0-ed3a562d47ae", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.5468081121575343, 1.0217117936643836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 1765.7857142857142, 85, 22492, 91.5, 11809.0, 22492.0, 22492.0, 0.08319665311749744, 0.0673535404632865, 0.02957381028786042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 9, 0, 0.0, 225.88888888888889, 169, 492, 173.0, 492.0, 492.0, 492.0, 0.047902406829818715, 0.07423937464738506, 0.10773363567292236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b92f727-d29d-43f7-8cc5-dbf07068f101", 1, 0, 0.0, 4184.0, 4184, 4184, 4184.0, 4184.0, 4184.0, 4184.0, 0.2390057361376673, 0.04317974725143403, 0.16478325167304014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b92f727-d29d-43f7-8cc5-dbf07068f101", 3, 0, 0.0, 330.6666666666667, 184, 441, 367.0, 441.0, 441.0, 441.0, 0.015038272403266313, 0.017774728872480463, 0.009643683800271691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4940b35-93f5-42ab-853c-a9956a3119d3", 1, 0, 0.0, 1814.0, 1814, 1814, 1814.0, 1814.0, 1814.0, 1814.0, 0.5512679162072768, 0.0995943012679162, 0.38007338754134506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/873f70f3-b845-4b6b-b1ec-826e9b29f598", 3, 0, 0.0, 4168.333333333334, 178, 11959, 368.0, 11959.0, 11959.0, 11959.0, 0.01892183390414199, 0.015774354371258997, 0.012134118747122304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 7662.0, 83, 19207, 5957.0, 19207.0, 19207.0, 19207.0, 0.047605446063029605, 0.03946974971436732, 0.01692224840521756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 605.55, 168, 1303, 573.5, 1072.5, 1291.4999999999998, 1303.0, 0.10418891534129684, 62.40381857258581, 0.22099445714970384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 1467.05, 83, 27473, 89.0, 242.00000000000034, 26112.24999999998, 27473.0, 0.10209081999346618, 0.07925996278789611, 0.036290096169552435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/303ade20-fc08-447c-b087-6e61d9ea8f5e", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c2efdcf-2eca-4b15-9ae0-0190442c9798", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7d1f043-fca0-485c-a26f-3bfff857b0c5", 3, 0, 0.0, 743.6666666666667, 370, 1434, 427.0, 1434.0, 1434.0, 1434.0, 0.016300981319075408, 0.016348738100283637, 0.010453428775578956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7d1f043-fca0-485c-a26f-3bfff857b0c5", 1, 0, 0.0, 927.0, 927, 927, 927.0, 927.0, 927.0, 927.0, 1.0787486515641855, 0.19489111380798274, 0.7437466289104638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 315.57142857142856, 168, 1354, 175.0, 928.0, 1354.0, 1354.0, 0.0915948628366929, 7.958907385735408, 0.20432503582013384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/829d911b-82d4-40b3-850b-57e9bb7344fd", 1, 0, 0.0, 2490.0, 2490, 2490, 2490.0, 2490.0, 2490.0, 2490.0, 0.40160642570281124, 0.1282473644578313, 0.23963039658634536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 129.36363636363637, 81, 248, 85.0, 247.8, 248.0, 248.0, 0.05476832996425122, 0.04070185459257342, 0.027491134376587036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80eb6068-147c-49e6-a7e3-d738efb9bc1d", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 129.45454545454547, 82, 254, 84.0, 253.6, 254.0, 254.0, 0.05477242059243842, 0.014655901603836062, 0.031237396119125037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 195.0, 82, 334, 245.0, 316.6000000000001, 334.0, 334.0, 0.05477269332271075, 0.014762952497136881, 0.032200352910421746], "isController": false}, {"data": ["register", 17, 2, 11.764705882352942, 6651.470588235295, 381, 27610, 1695.0, 23358.799999999996, 27610.0, 27610.0, 0.06844847440429695, 0.021909173907441556, 0.030882026537876164], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 181.27272727272728, 81, 331, 246.0, 316.20000000000005, 331.0, 331.0, 0.05477242059243842, 0.014762878987805669, 0.032253681266836295], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 100.0, 0.19665683382497542], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1017, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
