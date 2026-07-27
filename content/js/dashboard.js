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

    var data = {"OkPercent": 96.54377880184332, "KoPercent": 3.456221198156682};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7011795543905636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e93b780-a918-4904-aeb7-06d7915ef0d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77df1705-3b5e-4c72-9b69-802752c81887"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55dfbdfc-852d-494b-8c73-d1dd4111e1ae"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18fc73bd-39f0-42a9-b0ca-b9a48aa4826d"], "isController": false}, {"data": [0.625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7668160-0186-4f30-bcf3-cce88b182cc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0640e918-8840-4d39-8356-97ecd28583c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df6c166f-3c00-44ba-be7a-a997b63e9fb7"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/342d1995-f038-40dd-a971-2364c1fff6cf"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84f8b3d8-aee9-4a13-9f67-4cd6e7b09fc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c4c56d7-8bd6-4f8a-abbf-38478571e2f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fa3572a-5e81-4d7e-af84-f5f2999c6e21"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4ecbb30-207c-4ba6-8d35-0955faaf4c6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41beda5e-3a02-44a0-9407-1b033f02896e"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e9617bc-c744-4c63-9682-952e8dfbf5cc"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4ecbb30-207c-4ba6-8d35-0955faaf4c6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18fc73bd-39f0-42a9-b0ca-b9a48aa4826d"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4e93b780-a918-4904-aeb7-06d7915ef0d3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c4c56d7-8bd6-4f8a-abbf-38478571e2f0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/55dfbdfc-852d-494b-8c73-d1dd4111e1ae"], "isController": false}, {"data": [0.14814814814814814, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df6c166f-3c00-44ba-be7a-a997b63e9fb7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8628048780487805, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f7668160-0186-4f30-bcf3-cce88b182cc4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0640e918-8840-4d39-8356-97ecd28583c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=342d1995-f038-40dd-a971-2364c1fff6cf"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a6e3b6a-4a8e-4eca-b576-9a17345bfb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84f8b3d8-aee9-4a13-9f67-4cd6e7b09fc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e9617bc-c744-4c63-9682-952e8dfbf5cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41beda5e-3a02-44a0-9407-1b033f02896e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 45, 3.456221198156682, 490.54838709677415, 137, 2784, 163.5, 1372.7, 1590.85, 2250.9700000000003, 5.106863671842825, 754.0932612725093, 3.7287342714874625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2351.571428571428, 1749, 2967, 2280.5, 2905.9, 2947.55, 2967.0, 0.2464788732394366, 296.59744477607836, 1.2119346941021127], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e93b780-a918-4904-aeb7-06d7915ef0d3", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77df1705-3b5e-4c72-9b69-802752c81887", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 516.5624999999999, 145, 1436, 505.5, 940.4000000000005, 1436.0, 1436.0, 0.10209551034993236, 0.021361292082493172, 0.06817168476734985], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 516.5624999999999, 145, 1436, 505.5, 940.4000000000005, 1436.0, 1436.0, 0.10094382476152021, 0.021120326616362994, 0.06740267595770454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 254.84999999999997, 140, 430, 146.5, 426.0, 429.8, 430.0, 0.10827022081711536, 0.03710158250461502, 0.061293209968439226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 188.89999999999998, 141, 447, 147.0, 436.00000000000006, 446.55, 447.0, 0.10843282044609262, 0.08058337535105126, 0.05442819307548009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 298.25, 139, 722, 147.0, 589.0000000000001, 715.4999999999999, 722.0, 0.1082731515066209, 1.6195189254701763, 0.06329327001158523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 253.00000000000006, 139, 1513, 143.0, 423.8, 1458.5499999999993, 1513.0, 0.10843811165872358, 4.906406261013245, 0.06328380422583321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55dfbdfc-852d-494b-8c73-d1dd4111e1ae", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18fc73bd-39f0-42a9-b0ca-b9a48aa4826d", 3, 0, 0.0, 447.0, 250, 585, 506.0, 585.0, 585.0, 585.0, 0.08729558284350811, 0.03949897791421754, 0.055980565820869466], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 420.25000000000006, 142, 2410, 261.0, 1196.9000000000012, 2410.0, 2410.0, 0.10184271665446676, 0.13622955189204672, 0.06581486108016932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7668160-0186-4f30-bcf3-cce88b182cc4", 1, 0, 0.0, 954.0, 954, 954, 954.0, 954.0, 954.0, 954.0, 1.0482180293501049, 0.1893753275681342, 0.7226971960167715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0640e918-8840-4d39-8356-97ecd28583c6", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.1806640625, 0.689453125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 163.2142857142857, 138, 426, 143.5, 286.0, 426.0, 426.0, 0.07685255836677335, 0.057114059489369644, 0.03857638183644678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 1058.2222222222222, 872, 1201, 1099.0, 1201.0, 1201.0, 1201.0, 0.045724040176189966, 13.444385992821326, 0.026076991662983343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 202.92857142857142, 137, 436, 142.5, 430.0, 436.0, 436.0, 0.07685171461664718, 0.028808671480877644, 0.04336846897660963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1408.4444444444443, 1114, 1616, 1441.0, 1616.0, 1616.0, 1616.0, 0.04556962025316456, 41.00362440664557, 0.02594442246835443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 340.22222222222223, 140, 504, 422.0, 504.0, 504.0, 504.0, 0.04582718061001069, 0.08109262818880798, 0.025375011138550844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 209.14285714285717, 140, 495, 146.0, 462.0, 495.0, 495.0, 0.07344185241335173, 0.054579345397031895, 0.03686436732467069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 242.42857142857144, 138, 436, 144.5, 430.5, 436.0, 436.0, 0.07333644140156416, 0.027490934437221386, 0.041384752437127095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 265.21428571428567, 141, 1290, 144.0, 856.5, 1290.0, 1290.0, 0.0734410818920521, 4.738553231997755, 0.042724513321687675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 294.57142857142856, 139, 1128, 146.0, 783.0, 1128.0, 1128.0, 0.07333720972870471, 1.5586100994504948, 0.04273570382767851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 177.7777777777778, 141, 440, 146.0, 440.0, 440.0, 440.0, 0.045894483483085335, 0.034107130791628845, 0.025770828127709047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 868.2352941176472, 140, 1817, 1256.0, 1725.0, 1817.0, 1817.0, 0.09926485615354522, 47.29895696175092, 0.05384069231398058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 221.7142857142857, 137, 962, 143.0, 690.0, 962.0, 962.0, 0.07685255836677335, 4.958667947885731, 0.0447091473757596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 671.4705882352941, 137, 1258, 863.0, 1191.6, 1258.0, 1258.0, 0.09925963986267138, 15.463805720420627, 0.053934796269589184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 258.2857142857143, 140, 1174, 143.5, 800.0, 1174.0, 1174.0, 0.07685044902619502, 1.6332757469589179, 0.04478296952879696], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 477.8125, 142, 1000, 491.0, 967.8000000000001, 1000.0, 1000.0, 0.10113588237896878, 0.021160510546576233, 0.06792597959583573], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/df6c166f-3c00-44ba-be7a-a997b63e9fb7", 3, 0, 0.0, 341.3333333333333, 257, 504, 263.0, 504.0, 504.0, 504.0, 0.03906097418069607, 0.032563526978112836, 0.02504886690624064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 538.1428571428571, 282, 1436, 296.0, 1177.5, 1436.0, 1436.0, 0.07328193129295499, 6.367650828282114, 0.16347350465601984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/342d1995-f038-40dd-a971-2364c1fff6cf", 3, 0, 0.0, 389.3333333333333, 287, 550, 331.0, 550.0, 550.0, 550.0, 0.1048767697954903, 0.04745400716657927, 0.06725495979723825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 601.875, 170, 1506, 489.5, 1164.5, 1433.25, 1506.0, 0.10411153816121671, 0.06395132568691926, 0.04707386930531576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 146.94117647058823, 139, 162, 147.0, 157.2, 162.0, 162.0, 0.09941869305355742, 0.07388439981812227, 0.04990352366164895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 226.9411764705882, 137, 442, 145.0, 431.59999999999997, 442.0, 442.0, 0.0994216002198972, 0.10565829527045599, 0.05228086675166239], "isController": false}, {"data": ["login", 24, 0, 0.0, 3131.5833333333326, 1586, 4666, 3232.5, 4244.0, 4585.75, 4666.0, 0.10177771746505632, 45.7960841354513, 0.2168491553509635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/84f8b3d8-aee9-4a13-9f67-4cd6e7b09fc4", 3, 0, 0.0, 363.3333333333333, 262, 479, 349.0, 479.0, 479.0, 479.0, 0.04578684696509516, 0.02997309545794478, 0.029362007982173654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c4c56d7-8bd6-4f8a-abbf-38478571e2f0", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 167.57142857142858, 144, 413, 149.5, 283.0, 413.0, 413.0, 0.07617223630804051, 0.061666781151724206, 0.02707684962512378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa3572a-5e81-4d7e-af84-f5f2999c6e21", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.7374963914549654, 1.3780131351039262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1017.7058823529412, 284, 1968, 1408.0, 1876.0, 1968.0, 1968.0, 0.0991722037813778, 62.884087200077, 0.20960724343567513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4ecbb30-207c-4ba6-8d35-0955faaf4c6f", 3, 0, 0.0, 369.0, 237, 493, 377.0, 493.0, 493.0, 493.0, 0.023574341686508404, 0.023643407140668097, 0.0151176605216216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41beda5e-3a02-44a0-9407-1b033f02896e", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 907.8823529411765, 140, 1979, 1257.0, 1802.9999999999998, 1979.0, 1979.0, 0.08542670639846031, 54.11666037482224, 0.1286160700825624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 571.2999999999998, 285, 1661, 564.5, 867.3000000000001, 1621.3499999999995, 1661.0, 0.10818354420109157, 6.6305366732072635, 0.24192333775984334], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 1104.8461538461538, 320, 2081, 1073.0, 1920.0000000000002, 2068.75, 2081.0, 0.10137756514483345, 0.03163479609462426, 0.04573870614932916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e9617bc-c744-4c63-9682-952e8dfbf5cc", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 462.5, 280, 1315, 292.0, 1081.0, 1315.0, 1315.0, 0.07678932847732246, 6.6724173674835585, 0.17129762309603602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 188.47058823529412, 142, 512, 147.0, 461.59999999999997, 512.0, 512.0, 0.12669548367864064, 0.09836221633253837, 0.04503628521389178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4ecbb30-207c-4ba6-8d35-0955faaf4c6f", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18fc73bd-39f0-42a9-b0ca-b9a48aa4826d", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 486.35294117647067, 284, 1421, 301.0, 976.1999999999996, 1421.0, 1421.0, 0.09077462795751746, 6.52052591215152, 0.20278805759650145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 142.0, 140, 145, 141.5, 145.0, 145.0, 145.0, 0.04006530644951271, 0.029775095906327313, 0.020110905776415555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 142.75, 140, 145, 143.0, 145.0, 145.0, 145.0, 0.04006450385120044, 0.010720384819559491, 0.022849287352637748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 215.5, 139, 434, 144.5, 434.0, 434.0, 434.0, 0.04006691174261016, 0.010799284805625394, 0.023554961786182927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 212.5, 139, 428, 141.5, 428.0, 428.0, 428.0, 0.04006691174261016, 0.010799284805625394, 0.02359408962968157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e93b780-a918-4904-aeb7-06d7915ef0d3", 3, 0, 0.0, 1044.6666666666667, 244, 2410, 480.0, 2410.0, 2410.0, 2410.0, 0.0395340256180486, 0.0245929436706025, 0.025352223459490803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 151.0, 142, 160, 151.0, 160.0, 160.0, 160.0, 0.05626274702862367, 0.01659311484633237, 0.03477960827062381], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1576.5357142857144, 1117, 2357, 1426.5, 2296.2000000000003, 2336.35, 2357.0, 0.24924336834609226, 298.18171955670283, 0.49215829179277193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 1104.8461538461538, 320, 2081, 1073.0, 1920.0000000000002, 2068.75, 2081.0, 0.10198038054371232, 0.031822904205121766, 0.04601067950312021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 181.0, 137, 415, 143.0, 415.0, 415.0, 415.0, 0.03910243161264014, 0.010539327270594413, 0.02302613892814649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 223.0, 139, 426, 147.0, 426.0, 426.0, 426.0, 0.03910090267226741, 0.010538915173384573, 0.022987054110063455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 341.94117647058823, 139, 1572, 143.0, 1528.0, 1572.0, 1572.0, 0.12726360784842156, 13.502268169687307, 0.07353040945194302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 333.52941176470586, 138, 1156, 144.0, 1015.1999999999998, 1156.0, 1156.0, 0.12726360784842156, 4.432586782551411, 0.0736546903189825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 223.42857142857144, 138, 429, 146.0, 429.0, 429.0, 429.0, 0.039102213185266285, 0.010462896887463831, 0.022300480957222178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 179.58823529411768, 141, 434, 145.0, 432.4, 434.0, 434.0, 0.12711515885656177, 0.0944674178611753, 0.06380585122292261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 143.00000000000003, 139, 147, 142.0, 147.0, 147.0, 147.0, 0.03910090267226741, 0.02905838567733935, 0.019626820286665476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 225.4705882352941, 139, 430, 145.0, 425.2, 430.0, 430.0, 0.12725789186073497, 0.05653794437332974, 0.07131939297985583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 151.00000000000003, 145, 159, 150.0, 159.0, 159.0, 159.0, 0.03944817636716108, 0.03105002944524593, 0.014022593943014292], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 656.625, 140, 2708, 498.5, 1800.1000000000008, 2708.0, 2708.0, 0.10047852899433553, 0.02033610852937113, 0.0683675928484407], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1701.7916666666663, 1108, 2784, 1527.5, 2567.0, 2761.25, 2784.0, 0.1027643613194944, 0.05318858544856644, 0.04726759197410338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 408.85714285714283, 287, 576, 296.0, 576.0, 576.0, 576.0, 0.03906860446944835, 0.06054870634083451, 0.0878662071222066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c4c56d7-8bd6-4f8a-abbf-38478571e2f0", 3, 0, 0.0, 662.3333333333333, 258, 1411, 318.0, 1411.0, 1411.0, 1411.0, 0.04503017021404341, 0.02895006060310408, 0.028876769310437995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55dfbdfc-852d-494b-8c73-d1dd4111e1ae", 3, 0, 0.0, 502.0, 302, 677, 527.0, 677.0, 677.0, 677.0, 0.041677664939359, 0.03474495439768828, 0.026726887998221757], "isController": false}, {"data": ["addBook", 54, 20, 37.03703703703704, 1354.4259259259263, 731, 2792, 1139.0, 2322.0, 2462.5, 2792.0, 0.2691548537591961, 90.59710224738073, 0.9736663205659231], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 241.75000000000006, 138, 588, 147.5, 568.6, 577.65, 588.0, 0.2506400272123458, 0.18626666084823745, 0.12115899752940545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df6c166f-3c00-44ba-be7a-a997b63e9fb7", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 895.0714285714283, 686, 1393, 842.0, 1143.9, 1275.1499999999999, 1393.0, 0.25035989234524625, 73.61412108030294, 0.12591342241972836], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 193.46428571428572, 138, 575, 147.0, 419.8, 430.6, 575.0, 0.2511582431480892, 0.4444323599456422, 0.1221453174685043], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1332.928571428572, 964, 1874, 1275.0, 1736.0, 1772.0, 1874.0, 0.24991409203086437, 224.87313931148668, 0.12544515947642998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 169.64705882352942, 144, 448, 152.0, 238.3999999999998, 448.0, 448.0, 0.09477985983731316, 0.07080721950736774, 0.03369127830154491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 20, 12.195121951219512, 200.21341463414643, 141, 709, 150.0, 349.5, 443.0, 679.0999999999997, 0.7010314566493261, 1.6605206748175823, 0.3311173076224347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 152.0, 147, 164, 148.5, 164.0, 164.0, 164.0, 0.03783829803335446, 0.02930251009809579, 0.013450332504043969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7668160-0186-4f30-bcf3-cce88b182cc4", 3, 0, 0.0, 1218.0, 339, 2708, 607.0, 2708.0, 2708.0, 2708.0, 0.044918248787207286, 0.028468694787985867, 0.02880499678085884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0640e918-8840-4d39-8356-97ecd28583c6", 3, 0, 0.0, 493.0, 254, 862, 363.0, 862.0, 862.0, 862.0, 0.041497793700634916, 0.02667908286417772, 0.02661154088224309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 150.45000000000005, 141, 165, 148.5, 162.9, 164.9, 165.0, 0.1050012075138864, 0.08521094086331993, 0.03732464798345181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=342d1995-f038-40dd-a971-2364c1fff6cf", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 360.0, 286, 575, 289.5, 575.0, 575.0, 575.0, 0.04000680115619656, 0.062002727963753834, 0.08997623345968814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 605.8235294117649, 284, 1720, 555.0, 1673.6, 1720.0, 1720.0, 0.1269755908099549, 18.045041848260436, 0.281748974392011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a6e3b6a-4a8e-4eca-b576-9a17345bfb17", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 171.78571428571428, 144, 424, 150.0, 298.0, 424.0, 424.0, 0.0773489209825523, 0.06413011124432315, 0.02749512425551664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84f8b3d8-aee9-4a13-9f67-4cd6e7b09fc4", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 152.23529411764707, 143, 178, 151.0, 162.0, 178.0, 178.0, 0.09952171036840596, 0.07726539037390892, 0.0353768579825193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 180.52941176470588, 139, 428, 145.0, 424.0, 428.0, 428.0, 0.09098207118009098, 0.06761460563286059, 0.04566873494781911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e9617bc-c744-4c63-9682-952e8dfbf5cc", 3, 0, 0.0, 722.0, 265, 1036, 865.0, 1036.0, 1036.0, 1036.0, 0.022297372626258874, 0.022362696960124866, 0.014298770857333979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 246.94117647058823, 138, 474, 146.0, 443.59999999999997, 474.0, 474.0, 0.09084884889164405, 0.03233567714456724, 0.05136341743977256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 251.70588235294122, 137, 1276, 142.0, 715.1999999999995, 1276.0, 1276.0, 0.09084933439502359, 4.831657561136258, 0.05295021523276134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 249.7647058823529, 138, 1112, 145.0, 567.1999999999995, 1112.0, 1112.0, 0.0909879146640405, 1.5968149044894508, 0.05311984011550113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41beda5e-3a02-44a0-9407-1b033f02896e", 3, 0, 0.0, 318.6666666666667, 243, 468, 245.0, 468.0, 468.0, 468.0, 0.026111478605995195, 0.026187977078473697, 0.016744665642516452], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.0, 0.6912442396313364], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 8.88888888888889, 0.30721966205837176], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 8.88888888888889, 0.30721966205837176], "isController": false}, {"data": ["401/Unauthorized", 28, 62.22222222222222, 2.150537634408602], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 45, "401/Unauthorized", 28, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
