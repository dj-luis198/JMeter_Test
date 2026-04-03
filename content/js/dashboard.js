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

    var data = {"OkPercent": 97.79299847792998, "KoPercent": 2.207001522070015};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8156862745098039, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6cfd98be-62de-47f3-86d5-0810f533f443"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1b14fbd-2a83-42ed-8824-61f2bdb0040f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffa80546-4a01-4880-ab59-2715fda2b1ff"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6230e3e6-21d8-474f-a1f6-b83de665c0ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dccba2e-8104-4559-9607-94539afc4759"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f8d0769-9ac9-45cc-abcb-6130964b7f6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85be8351-75ed-492d-baf2-c7fea3ee4c3e"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21019ba3-976b-41e2-8a7d-ed8dac10d1ef"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f8d0769-9ac9-45cc-abcb-6130964b7f6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7fb0284-965d-4202-9225-e85cab376e9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bcd5bad-eecf-4232-923b-f5c2e94ff1ae"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5ba092d-c488-4e1a-8507-df09a815c7dd"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cfd98be-62de-47f3-86d5-0810f533f443"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21019ba3-976b-41e2-8a7d-ed8dac10d1ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dccba2e-8104-4559-9607-94539afc4759"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d47d5a37-dc57-439d-8d6a-ab7ed7ccd913"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81982f55-1f00-4386-b31f-e4d006584c95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1b14fbd-2a83-42ed-8824-61f2bdb0040f"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6230e3e6-21d8-474f-a1f6-b83de665c0ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8090909090909091, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.903954802259887, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7fb0284-965d-4202-9225-e85cab376e9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87ff8fff-cd7a-4793-81e8-c139c3976d89"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffa80546-4a01-4880-ab59-2715fda2b1ff"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/81982f55-1f00-4386-b31f-e4d006584c95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdb77f23-39be-4c2e-a062-dabf88d2bb04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d47d5a37-dc57-439d-8d6a-ab7ed7ccd913"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bcd5bad-eecf-4232-923b-f5c2e94ff1ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5ba092d-c488-4e1a-8507-df09a815c7dd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 29, 2.207001522070015, 298.7792998477931, 77, 4341, 92.5, 803.0, 1006.25, 1468.8499999999945, 5.216873449131514, 706.3489454094292, 3.8191571029776674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1391.6181818181817, 957, 4681, 1311.0, 1647.0, 1704.5999999999997, 4681.0, 0.24920368096491666, 299.875001699116, 1.2253325524007377], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6cfd98be-62de-47f3-86d5-0810f533f443", 3, 0, 0.0, 595.6666666666666, 162, 1101, 524.0, 1101.0, 1101.0, 1101.0, 0.04818967455906448, 0.030542088660969576, 0.03090288375044174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1b14fbd-2a83-42ed-8824-61f2bdb0040f", 3, 0, 0.0, 345.0, 179, 481, 375.0, 481.0, 481.0, 481.0, 0.01629867872044506, 0.02246904439488439, 0.010451952174243741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffa80546-4a01-4880-ab59-2715fda2b1ff", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 415.85714285714283, 85, 818, 403.0, 685.5, 818.0, 818.0, 0.08515038165617492, 0.01677348477936928, 0.057293567344828635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 415.85714285714283, 85, 818, 403.0, 685.5, 818.0, 818.0, 0.08644323149497395, 0.01702815888265949, 0.05816346337894243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 156.92307692307693, 79, 359, 83.0, 341.4, 359.0, 359.0, 0.07706032638012081, 0.029522811338537867, 0.04345063174648338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 83.07692307692308, 79, 86, 83.0, 86.0, 86.0, 86.0, 0.07705895602897417, 0.05726744681450131, 0.038679983787981174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 160.46153846153845, 79, 695, 83.0, 549.7999999999998, 695.0, 695.0, 0.07705941280727441, 1.76209730899639, 0.044868352514211535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 170.3076923076923, 79, 928, 82.0, 652.3999999999997, 928.0, 928.0, 0.07705986959098993, 5.352911279267931, 0.044793364700652046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6230e3e6-21d8-474f-a1f6-b83de665c0ca", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dccba2e-8104-4559-9607-94539afc4759", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 188.8666666666667, 80, 524, 179.0, 360.80000000000007, 524.0, 524.0, 0.09062567969259769, 0.1741653280498562, 0.05857038556695426], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 91.6470588235294, 79, 241, 82.0, 117.7999999999999, 241.0, 241.0, 0.1111954161324926, 0.08263643718440125, 0.055814886613380084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 616.6666666666666, 491, 731, 637.0, 731.0, 731.0, 731.0, 0.03288518138917968, 9.669335219207138, 0.018754830011016535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 110.23529411764706, 77, 257, 82.0, 245.79999999999998, 257.0, 257.0, 0.11119614345610697, 0.03957785528803071, 0.06286721299948327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 886.0, 723, 1037, 904.0, 1037.0, 1037.0, 1037.0, 0.032832276316437474, 29.542539942516154, 0.01869259481687798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 176.0, 78, 324, 161.0, 324.0, 324.0, 324.0, 0.032989690721649485, 0.058376288659793815, 0.01826675257731959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 94.69230769230768, 80, 235, 83.0, 176.19999999999993, 235.0, 235.0, 0.06541999637673866, 0.04861779027607238, 0.03283777161879265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 130.0, 79, 242, 82.0, 241.2, 242.0, 242.0, 0.06541999637673866, 0.025063249813804624, 0.0368872064906701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f8d0769-9ac9-45cc-abcb-6130964b7f6f", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85be8351-75ed-492d-baf2-c7fea3ee4c3e", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 151.61538461538458, 79, 839, 82.0, 596.5999999999998, 839.0, 839.0, 0.0654196671648626, 4.544332557418338, 0.03802714727476763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 134.3076923076923, 78, 617, 81.0, 464.1999999999999, 617.0, 617.0, 0.0654196671648626, 1.4959343092186375, 0.03809103366848332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 107.16666666666667, 80, 233, 82.5, 233.0, 233.0, 233.0, 0.03298987210926246, 0.02451688737807493, 0.01852458638947843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 538.625, 79, 1030, 716.5, 990.1, 1030.0, 1030.0, 0.09693679720822024, 49.07487482468071, 0.05230232466556805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 125.11764705882354, 78, 646, 82.0, 334.7999999999997, 646.0, 646.0, 0.11119832548403977, 5.91388185382326, 0.06481032917974883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 376.8125, 79, 646, 486.0, 643.2, 646.0, 646.0, 0.09684467929279172, 16.02891749968223, 0.052347197254453345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 114.82352941176471, 79, 646, 81.0, 198.7999999999996, 646.0, 646.0, 0.11119687078923614, 1.9514769765243782, 0.06491807202613781], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 542.5, 85, 1514, 447.0, 1331.5, 1514.0, 1514.0, 0.0866009736423751, 0.01705923197307947, 0.05882535444541355], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/21019ba3-976b-41e2-8a7d-ed8dac10d1ef", 3, 0, 0.0, 298.0, 198, 416, 280.0, 416.0, 416.0, 416.0, 0.061373539821198426, 0.03981688309363556, 0.039357380679609665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 296.6153846153846, 164, 920, 171.0, 742.3999999999999, 920.0, 920.0, 0.06539268306178601, 6.11142567367039, 0.1457826513840613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 534.952380952381, 121, 1417, 494.0, 971.0, 1372.7999999999993, 1417.0, 0.08692484726062553, 0.053394266530208456, 0.03930293386881799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.00000000000001, 80, 90, 83.0, 86.5, 90.0, 90.0, 0.09693327355781464, 0.07203732536864935, 0.048655959578824924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f8d0769-9ac9-45cc-abcb-6130964b7f6f", 3, 0, 0.0, 294.3333333333333, 212, 427, 244.0, 427.0, 427.0, 427.0, 0.04867285352715945, 0.031291954985722625, 0.031212734846518268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 141.12499999999997, 78, 246, 83.0, 244.6, 246.0, 246.0, 0.0968405762014284, 0.10772804820844935, 0.05065452502723641], "isController": false}, {"data": ["login", 21, 0, 0.0, 2354.761904761905, 1377, 4040, 2208.0, 3279.0, 3965.499999999999, 4040.0, 0.09082927124648037, 31.170203376470027, 0.18007460570364572], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e7fb0284-965d-4202-9225-e85cab376e9c", 3, 0, 0.0, 358.0, 196, 478, 400.0, 478.0, 478.0, 478.0, 0.02011627205246324, 0.02377675254638477, 0.012900083314893417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 85.70588235294116, 80, 98, 85.0, 92.39999999999999, 98.0, 98.0, 0.11039462832726163, 0.08937221375322255, 0.039241840538206285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bcd5bad-eecf-4232-923b-f5c2e94ff1ae", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 633.3125, 164, 1112, 801.0, 1074.9, 1112.0, 1112.0, 0.09679078067814041, 65.20055375858261, 0.20375451816339493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 629.4, 80, 1121, 842.0, 1120.7, 1121.0, 1121.0, 0.045154473453685055, 32.417102031048216, 0.0729041903915796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5ba092d-c488-4e1a-8507-df09a815c7dd", 3, 0, 0.0, 354.3333333333333, 161, 585, 317.0, 585.0, 585.0, 585.0, 0.019543973941368076, 0.026942945846905538, 0.012533082247557004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 330.6153846153846, 163, 1015, 320.0, 786.5999999999998, 1015.0, 1015.0, 0.07702106229819002, 7.198182969458187, 0.17170628499274224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cfd98be-62de-47f3-86d5-0810f533f443", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 852.9130434782609, 112, 1843, 914.0, 1364.6000000000004, 1772.999999999999, 1843.0, 0.09394350319407911, 0.029453075220154556, 0.04238466648014116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 99.21428571428572, 82, 249, 87.0, 173.5, 249.0, 249.0, 0.07062823817859863, 0.054833446632798745, 0.02510613154004873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 237.0, 161, 727, 166.0, 545.3999999999999, 727.0, 727.0, 0.11113580795732385, 7.983110830184485, 0.24827438164363322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21019ba3-976b-41e2-8a7d-ed8dac10d1ef", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 268.9473684210526, 160, 488, 320.0, 486.0, 488.0, 488.0, 0.11629971047493129, 0.18024183644894134, 0.2615607746325847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dccba2e-8104-4559-9607-94539afc4759", 3, 0, 0.0, 299.3333333333333, 181, 453, 264.0, 453.0, 453.0, 453.0, 0.11798945960827499, 0.05338715783056714, 0.07566381361598365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 94.14285714285714, 80, 238, 82.0, 167.0, 238.0, 238.0, 0.07316779989651982, 0.054375679415284754, 0.0367268058074328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 80.42857142857144, 78, 84, 80.0, 83.5, 84.0, 84.0, 0.07316932950762267, 0.01957851199715685, 0.04172938323481606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 122.28571428571429, 80, 326, 82.0, 286.0, 326.0, 326.0, 0.07316856469407701, 0.019721214702700444, 0.043015113228353864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 110.57142857142857, 79, 327, 81.0, 284.5, 327.0, 327.0, 0.07316894709885124, 0.01972131777273725, 0.04308679209043682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 88.5, 85, 92, 88.5, 92.0, 92.0, 92.0, 0.02352360005175192, 0.0069376242340127734, 0.014541444172616177], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 948.3272727272729, 622, 4341, 812.0, 1298.6, 1361.3999999999999, 4341.0, 0.25248699691965865, 302.0622269984346, 0.49856319118315406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 852.9130434782609, 112, 1843, 914.0, 1364.6000000000004, 1772.999999999999, 1843.0, 0.09270679661741114, 0.029065344184059268, 0.041826699255121044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 144.39999999999998, 79, 245, 82.5, 244.4, 245.0, 245.0, 0.04706369600617476, 0.01268513681416429, 0.02771426630051111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 113.0, 80, 241, 83.0, 240.1, 241.0, 241.0, 0.04702784048156509, 0.01267547262979684, 0.0276472265331076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 159.6428571428571, 79, 700, 82.5, 472.5, 700.0, 700.0, 0.06928909389662066, 4.4706593553268466, 0.0403090850375151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d47d5a37-dc57-439d-8d6a-ab7ed7ccd913", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 165.0, 78, 620, 82.5, 433.0, 620.0, 620.0, 0.0692887509712798, 1.472569619728487, 0.04037655033580298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 128.79999999999998, 78, 242, 82.0, 241.9, 242.0, 242.0, 0.04702784048156509, 0.012583621378856285, 0.02682056527464259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 105.14285714285714, 80, 245, 83.0, 241.0, 245.0, 245.0, 0.06934297530894772, 0.05153320723643478, 0.03480692315312415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 156.20000000000002, 79, 339, 87.5, 329.90000000000003, 339.0, 339.0, 0.047062588536494684, 0.03497522448854732, 0.023623213386482683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 92.92857142857142, 80, 243, 81.0, 163.5, 243.0, 243.0, 0.06934366223692748, 0.025994199278825913, 0.039131572788556314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81982f55-1f00-4386-b31f-e4d006584c95", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 99.2, 84, 148, 88.5, 146.5, 148.0, 148.0, 0.04879262645828963, 0.03840513371619281, 0.017344253936345137], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 463.7692307692308, 82, 1101, 427.0, 894.5999999999998, 1101.0, 1101.0, 0.09141153472935154, 0.017125929057617395, 0.06221367973617225], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1276.2857142857144, 906, 2990, 1158.0, 1771.0000000000002, 2873.8999999999983, 2990.0, 0.08860871656603247, 0.04586193337890353, 0.040756548342384076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 318.8, 165, 578, 249.0, 569.3000000000001, 578.0, 578.0, 0.04700904924197908, 0.0728548448701375, 0.10572445351980256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1b14fbd-2a83-42ed-8824-61f2bdb0040f", 1, 0, 0.0, 1514.0, 1514, 1514, 1514.0, 1514.0, 1514.0, 1514.0, 0.6605019815059445, 0.1193289712681638, 0.45538515521796563], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 846.4426229508197, 406, 2466, 685.0, 1469.8000000000002, 1993.8999999999994, 2466.0, 0.27167861755667394, 70.31727560069923, 0.9902455963568343], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6230e3e6-21d8-474f-a1f6-b83de665c0ca", 3, 0, 0.0, 262.0, 175, 385, 226.0, 385.0, 385.0, 385.0, 0.04792179163604996, 0.031370678053416826, 0.0307310968499409], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 139.90909090909088, 80, 341, 84.0, 330.4, 334.2, 341.0, 0.25327414393339354, 0.18822424173175045, 0.12243232543655252], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 585.7636363636365, 389, 4004, 483.0, 724.6, 778.3999999999999, 4004.0, 0.253162226354648, 74.43810032531346, 0.12732279938734742], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 182.52727272727273, 79, 3616, 84.0, 244.0, 246.2, 3616.0, 0.25362101642080803, 0.4487903142133829, 0.12334303337652576], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 806.8545454545455, 538, 4259, 722.0, 973.4, 1032.3999999999999, 4259.0, 0.25292589271343496, 227.58316285984455, 0.1269569422409234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 96.21052631578947, 82, 237, 85.0, 142.0, 237.0, 237.0, 0.12250003223685058, 0.09151613736444404, 0.04354493333419298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 14, 7.909604519774011, 154.98870056497177, 80, 2134, 88.0, 248.60000000000005, 328.7999999999999, 1669.1199999999994, 0.7483384350002537, 1.5604793607096954, 0.36096115642598636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 96.78571428571429, 83, 248, 84.0, 170.0, 248.0, 248.0, 0.07649270041087508, 0.05923702287678119, 0.02719076459917825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 89.15384615384616, 81, 104, 89.0, 100.8, 104.0, 104.0, 0.08057817942901063, 0.06539108115772249, 0.028643024718906118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7fb0284-965d-4202-9225-e85cab376e9c", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 0.15723591166231504, 0.6000462358572671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87ff8fff-cd7a-4793-81e8-c139c3976d89", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 217.28571428571428, 161, 567, 165.0, 455.0, 567.0, 567.0, 0.07313645695658307, 0.11334722381845441, 0.16448560583106522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 289.42857142857144, 162, 938, 168.5, 715.0, 938.0, 938.0, 0.06925961471865755, 6.01814165168103, 0.15450073093629105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 88.3076923076923, 82, 96, 87.0, 95.2, 96.0, 96.0, 0.06531711459134096, 0.05415452176567234, 0.02321819307739073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffa80546-4a01-4880-ab59-2715fda2b1ff", 3, 0, 0.0, 326.6666666666667, 159, 463, 358.0, 463.0, 463.0, 463.0, 0.02166393460380274, 0.025606037287242107, 0.013892562229652149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81982f55-1f00-4386-b31f-e4d006584c95", 3, 0, 0.0, 535.0, 181, 870, 554.0, 870.0, 870.0, 870.0, 0.019890206062534808, 0.023509550199565066, 0.012755112611716657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb77f23-39be-4c2e-a062-dabf88d2bb04", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 96.56250000000001, 81, 248, 85.0, 141.6000000000001, 248.0, 248.0, 0.09531525520659581, 0.07399963661058952, 0.03388159462421961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d47d5a37-dc57-439d-8d6a-ab7ed7ccd913", 3, 0, 0.0, 460.6666666666667, 169, 859, 354.0, 859.0, 859.0, 859.0, 0.02220380129078098, 0.022268851489875067, 0.014238765801705253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bcd5bad-eecf-4232-923b-f5c2e94ff1ae", 3, 0, 0.0, 290.6666666666667, 252, 356, 264.0, 356.0, 356.0, 356.0, 0.02574797878366548, 0.025823412315258254, 0.016511561915306314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 98.10526315789474, 79, 242, 81.0, 241.0, 242.0, 242.0, 0.11635882612316888, 0.0864736979294253, 0.05840667639385625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 135.7894736842105, 79, 315, 82.0, 247.0, 315.0, 315.0, 0.11635811352877413, 0.03113488584656652, 0.066360486621879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 149.84210526315792, 77, 302, 81.0, 247.0, 302.0, 302.0, 0.11636167658803068, 0.03136310814286764, 0.06840793877538522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 131.36842105263153, 78, 244, 81.0, 244.0, 244.0, 244.0, 0.11635882612316888, 0.03136233985351036, 0.06851989467995198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5ba092d-c488-4e1a-8507-df09a815c7dd", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.532724505327245], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.228310502283105], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.36986301369863], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 29, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
