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

    var data = {"OkPercent": 99.70149253731343, "KoPercent": 0.29850746268656714};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8509677419354839, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2991993-e91e-403a-9606-2803cc82e1cf"], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebf32385-b704-45e4-a959-87d567710fdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ad10e49-587f-4359-a5ba-21d174eed361"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9440e4f-1386-40fe-ae5c-de94ffc5c40d"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6da06be8-e4c7-41eb-b94e-dd16f9aead30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0c431bc-617d-41d2-ba97-f4e482553811"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96386eea-38cd-464b-a800-7ff616f717f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b786792-40ce-4e1d-97e2-db1802084fa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5de502e3-0149-4b7f-b7c6-6967e04cf6a8"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c29ce28-ec4a-408f-bff3-496107f38108"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33083885-371b-459d-a403-dcbe387eae45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a896b074-a8e1-4209-8e63-cf844e8b0d17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac1a2b77-191a-458b-8c8c-3204944a25f5"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dad55bcf-a99e-46ac-b18c-99c92a6e6f5d"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebf32385-b704-45e4-a959-87d567710fdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99fac05e-33d0-4964-8163-5329cef87419"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0c431bc-617d-41d2-ba97-f4e482553811"], "isController": false}, {"data": [0.4846153846153846, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b9bedea-4020-4179-9ff0-d053820d7931"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2991993-e91e-403a-9606-2803cc82e1cf"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96386eea-38cd-464b-a800-7ff616f717f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe25cc7a-71bf-4ff2-a11d-afa4a3467bd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41c7deea-f905-48bd-b5b9-ccd2bd90dab7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.983957219251337, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6da06be8-e4c7-41eb-b94e-dd16f9aead30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a896b074-a8e1-4209-8e63-cf844e8b0d17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dad55bcf-a99e-46ac-b18c-99c92a6e6f5d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33083885-371b-459d-a403-dcbe387eae45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99fac05e-33d0-4964-8163-5329cef87419"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c29ce28-ec4a-408f-bff3-496107f38108"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b786792-40ce-4e1d-97e2-db1802084fa2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 4, 0.29850746268656714, 259.7007462686565, 77, 1692, 93.0, 647.9000000000001, 796.0, 1110.1299999999994, 5.319930285092681, 734.9014914972923, 3.8830807607103295], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f2991993-e91e-403a-9606-2803cc82e1cf", 3, 0, 0.0, 355.66666666666663, 172, 637, 258.0, 637.0, 637.0, 637.0, 0.03397470017327097, 0.02832330961710513, 0.02178716124392702], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1166.035087719298, 958, 1622, 1137.0, 1397.6000000000001, 1450.5999999999997, 1622.0, 0.25245590879698115, 303.7895185538484, 1.2413237312429688], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebf32385-b704-45e4-a959-87d567710fdc", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ad10e49-587f-4359-a5ba-21d174eed361", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 587.75, 402, 1154, 465.0, 1079.9000000000003, 1154.0, 1154.0, 0.07578101811797841, 0.013690906593580085, 0.05150741075206346], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 587.75, 402, 1154, 465.0, 1079.9000000000003, 1154.0, 1154.0, 0.07485683630057516, 0.013523940151959377, 0.05087925592304717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 130.1875, 79, 243, 82.0, 242.3, 243.0, 243.0, 0.09794739000814187, 0.04459762753056264, 0.05483236457242903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 93.4375, 80, 244, 83.5, 134.80000000000013, 244.0, 244.0, 0.09794199385413989, 0.07278697004199264, 0.04916228988381631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 169.06250000000003, 78, 569, 81.5, 548.0, 569.0, 569.0, 0.09794679040611189, 3.623050820610453, 0.05662548820353343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 178.5625, 79, 711, 82.5, 589.2000000000002, 711.0, 711.0, 0.09794439207140146, 11.039416209337773, 0.05652845284589674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9440e4f-1386-40fe-ae5c-de94ffc5c40d", 2, 0, 0.0, 245.0, 170, 320, 245.0, 320.0, 320.0, 320.0, 0.016253027126302274, 0.027490471662847203, 0.010102589615128317], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 187.6923076923077, 154, 233, 180.0, 229.4, 233.0, 233.0, 0.08153639659303304, 0.19867759136780444, 0.05271200639119909], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 82.4375, 78, 91, 82.0, 87.5, 91.0, 91.0, 0.0805116515455721, 0.05983336604119177, 0.040413075092210995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 91.6875, 78, 243, 81.5, 133.1000000000001, 243.0, 243.0, 0.08044728691524879, 0.021525934194119304, 0.04588009331885282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 402.0, 400, 404, 402.0, 404.0, 404.0, 404.0, 0.04945598417408506, 14.54170144040554, 0.02820536597428289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 708.5, 686, 731, 708.5, 731.0, 731.0, 731.0, 0.04910867750331484, 44.188074341329866, 0.027959334945734913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 158.0, 83, 233, 158.0, 233.0, 233.0, 233.0, 0.04966106324336404, 0.08787680331735902, 0.02749787388572989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 92.82352941176471, 81, 233, 83.0, 126.59999999999991, 233.0, 233.0, 0.09238427510950253, 0.06865667320149553, 0.046372575592074514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 100.88235294117646, 78, 251, 82.0, 243.79999999999998, 251.0, 251.0, 0.0923847771624831, 0.024720145451680043, 0.05268819322547863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 90.76470588235293, 78, 247, 81.0, 118.99999999999989, 247.0, 247.0, 0.09238678542897359, 0.024901125760153037, 0.05431332502758018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 99.4705882352941, 79, 236, 81.0, 235.2, 236.0, 236.0, 0.09238678542897359, 0.024901125760153037, 0.054403546497725656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6da06be8-e4c7-41eb-b94e-dd16f9aead30", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.049846721331904396, 0.03704429192732348, 0.027990102310395535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0c431bc-617d-41d2-ba97-f4e482553811", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 419.8947368421054, 80, 784, 544.0, 733.0, 784.0, 784.0, 0.10372651140445696, 49.1360310927042, 0.056288266211361876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 90.43749999999999, 78, 236, 80.5, 130.30000000000013, 236.0, 236.0, 0.08051246181948099, 0.021700624474781986, 0.04733252149934332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 346.10526315789474, 78, 646, 393.0, 566.0, 646.0, 646.0, 0.10372707768066254, 16.065456221713898, 0.056389869481310015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 80.875, 77, 83, 81.5, 83.0, 83.0, 83.0, 0.0805120566804879, 0.021700515277162755, 0.047410908377279494], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 540.0, 347, 1050, 466.0, 991.2000000000003, 1050.0, 1050.0, 0.07891074477395658, 0.01425633572576364, 0.054405259580481785], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/96386eea-38cd-464b-a800-7ff616f717f1", 3, 0, 0.0, 287.3333333333333, 189, 466, 207.0, 466.0, 466.0, 466.0, 0.03226049272525889, 0.03235500588753992, 0.020687881077070317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 205.23529411764707, 164, 476, 166.0, 376.7999999999999, 476.0, 476.0, 0.09234212213060436, 0.1431122537317081, 0.20767959694021662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b786792-40ce-4e1d-97e2-db1802084fa2", 3, 0, 0.0, 294.6666666666667, 173, 532, 179.0, 532.0, 532.0, 532.0, 0.02954704381826598, 0.02963360742320231, 0.018947811302729163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5de502e3-0149-4b7f-b7c6-6967e04cf6a8", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 582.05, 89, 1075, 484.0, 1061.1000000000004, 1074.9, 1075.0, 0.09425959091337544, 0.05789969012159487, 0.0426193267508719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 99.10526315789474, 77, 244, 82.0, 233.0, 244.0, 244.0, 0.10371009208364491, 0.07707361335513065, 0.052057604815423326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 114.78947368421053, 77, 247, 82.0, 243.0, 247.0, 247.0, 0.10372537887059441, 0.10974972499126524, 0.054570979549722676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c29ce28-ec4a-408f-bff3-496107f38108", 3, 0, 0.0, 252.33333333333334, 191, 361, 205.0, 361.0, 361.0, 361.0, 0.061656082372526046, 0.03963892014509732, 0.03953856844852745], "isController": false}, {"data": ["login", 20, 0, 0.0, 2022.2999999999997, 1375, 2837, 1916.0, 2573.5000000000005, 2824.85, 2837.0, 0.09686590368623196, 11.72600548321556, 0.1622125504308111], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 95.0625, 81, 249, 84.0, 139.1000000000001, 249.0, 249.0, 0.07858700563861765, 0.06362170671329495, 0.02793522466060237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33083885-371b-459d-a403-dcbe387eae45", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a896b074-a8e1-4209-8e63-cf844e8b0d17", 3, 0, 0.0, 342.3333333333333, 154, 449, 424.0, 449.0, 449.0, 449.0, 0.02768191632679425, 0.027763015691032907, 0.01775174972779449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac1a2b77-191a-458b-8c8c-3204944a25f5", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 2.0470252403846154, 3.8248697916666665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 533.6315789473684, 161, 894, 632.0, 816.0, 894.0, 894.0, 0.10366312757111835, 65.3482797632525, 0.2191812334957389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dad55bcf-a99e-46ac-b18c-99c92a6e6f5d", 3, 0, 0.0, 279.6666666666667, 207, 399, 233.0, 399.0, 399.0, 399.0, 0.025394030709847807, 0.02546842728419306, 0.016284583495572973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 323.75, 161, 796, 317.5, 694.5000000000001, 796.0, 796.0, 0.09789165840705799, 14.771805844896786, 0.21702982177599942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 792.0, 769, 815, 792.0, 815.0, 815.0, 815.0, 0.0490075961774075, 58.63012282528792, 0.11050638630237686], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 865.4761904761905, 99, 1332, 851.0, 1264.8, 1325.8999999999999, 1332.0, 0.08498102090533115, 0.027267905703440516, 0.03834104654127245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 88.46666666666665, 81, 113, 85.0, 106.4, 113.0, 113.0, 0.07803152473599334, 0.06058111539561983, 0.027737768558497633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 185.56249999999997, 159, 325, 167.0, 318.7, 325.0, 325.0, 0.08041332448786764, 0.1246249472287558, 0.180851451460507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 282.375, 161, 781, 317.5, 475.1000000000003, 781.0, 781.0, 0.15942288914130845, 12.151957180631117, 0.35599644910424266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebf32385-b704-45e4-a959-87d567710fdc", 3, 0, 0.0, 477.6666666666667, 178, 883, 372.0, 883.0, 883.0, 883.0, 0.020090406830738324, 0.02769624769797422, 0.012883496567888834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 82.71428571428571, 80, 85, 83.0, 85.0, 85.0, 85.0, 0.06367340998399068, 0.04731979003693058, 0.03196106712087032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 81.28571428571429, 78, 87, 81.0, 85.0, 87.0, 87.0, 0.06367398917542184, 0.023868862850775458, 0.0359320990812753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 137.35714285714283, 79, 698, 82.0, 469.5, 698.0, 698.0, 0.06367369957838914, 4.1083438200694955, 0.037042316858521586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 140.2857142857143, 79, 578, 82.0, 411.0, 578.0, 578.0, 0.06367340998399068, 1.3532287393347038, 0.037104329450771356], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 746.8596491228071, 620, 1278, 649.0, 1039.6000000000001, 1117.4999999999998, 1278.0, 0.25181238651876, 301.2551584264376, 0.4972310991610671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 865.4761904761905, 99, 1332, 851.0, 1264.8, 1325.8999999999999, 1332.0, 0.08602855328649557, 0.02760402797976281, 0.03881366368980562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 96.33333333333333, 78, 237, 79.0, 237.0, 237.0, 237.0, 0.04734549586516003, 0.012761090682406414, 0.027880208990909663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99fac05e-33d0-4964-8163-5329cef87419", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 133.11111111111111, 79, 241, 81.0, 241.0, 241.0, 241.0, 0.04738463158448943, 0.012771638981756917, 0.027856980677600233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 282.2666666666666, 79, 725, 234.0, 722.6, 725.0, 725.0, 0.07545499361147721, 18.120123721037857, 0.042630106416692654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 253.0, 80, 586, 239.0, 568.0, 586.0, 586.0, 0.07545765065119953, 5.9314626019307095, 0.042705296686906084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 103.06666666666665, 78, 244, 82.0, 242.2, 244.0, 244.0, 0.0756372437788367, 0.056210881362983134, 0.037966350881173894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 151.66666666666666, 78, 245, 83.0, 245.0, 245.0, 245.0, 0.04734350341925302, 0.012668085875854813, 0.02700059179379274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 127.86666666666667, 78, 317, 80.0, 273.8, 317.0, 317.0, 0.07554848197916876, 0.050473862113947256, 0.041394272417752884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 99.33333333333334, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.047384382107657316, 0.03521436990617892, 0.023784738675132675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 102.44444444444444, 80, 243, 85.0, 243.0, 243.0, 243.0, 0.048490595518391404, 0.038167402331858856, 0.017236891375678194], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 449.0909090909091, 353, 637, 449.0, 616.0000000000001, 637.0, 637.0, 0.07661874512426169, 0.01384225375780118, 0.05215162631993201], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1046.2, 657, 1692, 1035.0, 1387.0000000000002, 1677.2499999999998, 1692.0, 0.0950078143927338, 0.049173966433739176, 0.04369988337790784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 269.77777777777777, 161, 482, 315.0, 482.0, 482.0, 482.0, 0.047323090513297784, 0.0733415475044957, 0.10643073969934064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0c431bc-617d-41d2-ba97-f4e482553811", 3, 0, 0.0, 293.3333333333333, 157, 499, 224.0, 499.0, 499.0, 499.0, 0.018657296557728784, 0.025720589492832492, 0.011964477284741442], "isController": false}, {"data": ["addBook", 65, 2, 3.076923076923077, 822.9384615384616, 432, 1914, 690.0, 1293.3999999999999, 1456.6999999999994, 1914.0, 0.2996385897625018, 100.37155365201818, 1.089656259795877], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9b9bedea-4020-4179-9ff0-d053820d7931", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2991993-e91e-403a-9606-2803cc82e1cf", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 0.1720610119047619, 0.6566220238095238], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 143.10526315789483, 80, 618, 83.0, 325.6, 351.09999999999945, 618.0, 0.2524436098550442, 0.1876070186520397, 0.12203084656078797], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 454.2631578947368, 382, 647, 406.0, 578.6000000000001, 633.3, 647.0, 0.25272903014126225, 74.31072625511, 0.1271049321511231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96386eea-38cd-464b-a800-7ff616f717f1", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe25cc7a-71bf-4ff2-a11d-afa4a3467bd1", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 137.5438596491228, 79, 331, 85.0, 249.0, 251.1, 331.0, 0.25290395861248904, 0.44752145801350596, 0.12299430799708938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41c7deea-f905-48bd-b5b9-ccd2bd90dab7", 2, 0, 0.0, 192.5, 190, 195, 192.5, 195.0, 195.0, 195.0, 0.025210189958781336, 0.029026185509182813, 0.015670201082777658], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 599.0701754385965, 535, 791, 557.0, 720.8, 733.5999999999997, 791.0, 0.25253867829230686, 227.23474664306318, 0.1267625787521931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 95.62499999999997, 81, 243, 84.0, 146.4000000000001, 243.0, 243.0, 0.1670477443334273, 0.12479641056159363, 0.059380252868522984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 187, 2, 1.0695187165775402, 146.58288770053485, 79, 946, 91.0, 264.20000000000005, 316.9999999999999, 783.2000000000008, 0.7665096756475367, 1.5577933756860671, 0.3728032337383128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 120.99999999999999, 83, 246, 88.5, 246.0, 246.0, 246.0, 0.06290042862149217, 0.04871097646176103, 0.022359136736546048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6da06be8-e4c7-41eb-b94e-dd16f9aead30", 3, 0, 0.0, 506.3333333333333, 180, 919, 420.0, 919.0, 919.0, 919.0, 0.04866732637931314, 0.03128840156222118, 0.03120919041902568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 89.68750000000001, 81, 135, 85.0, 111.90000000000002, 135.0, 135.0, 0.0983919072656274, 0.07984733880638317, 0.034975248285828486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a896b074-a8e1-4209-8e63-cf844e8b0d17", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dad55bcf-a99e-46ac-b18c-99c92a6e6f5d", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 233.14285714285714, 162, 781, 166.5, 555.0, 781.0, 781.0, 0.06364967220418814, 5.530679674784273, 0.14198636419433153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 419.2, 160, 966, 324.0, 870.6, 966.0, 966.0, 0.07542274448282624, 24.147539340817787, 0.16448148905867388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33083885-371b-459d-a403-dcbe387eae45", 3, 0, 0.0, 471.3333333333333, 193, 868, 353.0, 868.0, 868.0, 868.0, 0.02561562894907613, 0.025690674737012874, 0.016426689137265617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99fac05e-33d0-4964-8163-5329cef87419", 3, 0, 0.0, 289.6666666666667, 174, 452, 243.0, 452.0, 452.0, 452.0, 0.0439973014988414, 0.03601992619452673, 0.028214415349191915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 86.0, 81, 93, 85.0, 91.4, 93.0, 93.0, 0.09468853043400767, 0.07850640853366456, 0.03365881355271366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 95.10526315789475, 82, 246, 85.0, 99.0, 246.0, 246.0, 0.10040903469924851, 0.07795427986904548, 0.0356922740532485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c29ce28-ec4a-408f-bff3-496107f38108", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.5206457132564842, 1.9868966138328532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 82.81250000000001, 78, 102, 82.0, 90.10000000000001, 102.0, 102.0, 0.16054424499051784, 0.11931071331814852, 0.08058568547375604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 110.1875, 78, 241, 82.0, 239.6, 241.0, 241.0, 0.16054585591009432, 0.058029330975316075, 0.09071859948826008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 169.0, 78, 701, 82.5, 379.70000000000033, 701.0, 701.0, 0.15954847780780393, 9.012940643603601, 0.09294010450425297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 169.125, 78, 565, 84.0, 337.5000000000002, 565.0, 565.0, 0.15976514523650234, 2.9763864306968753, 0.09322233816290053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b786792-40ce-4e1d-97e2-db1802084fa2", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 50.0, 0.14925373134328357], "isController": false}, {"data": ["401/Unauthorized", 2, 50.0, 0.14925373134328357], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 4, "406/Not Acceptable", 2, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 187, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
