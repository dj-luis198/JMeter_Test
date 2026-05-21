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

    var data = {"OkPercent": 98.0349344978166, "KoPercent": 1.965065502183406};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8138364779874214, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/04dee71b-5d36-4f8e-a781-40bf5a435829"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec94a6f6-d8ec-4353-bdbd-9b1bbf249058"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fca9f890-d423-4fec-a272-dbc94aa38f9c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60074f5d-5dfc-4103-ac1b-286d0198a874"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c10c3c77-2153-4247-bb10-dd3089ca094e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3787878787878788, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04dee71b-5d36-4f8e-a781-40bf5a435829"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a118cccd-caa4-4b64-a721-c010ad6cc122"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a118cccd-caa4-4b64-a721-c010ad6cc122"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8008cd7-9cac-447c-be7e-ff75e41a6d38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60074f5d-5dfc-4103-ac1b-286d0198a874"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13ada261-089e-472a-95a2-dbfd39f2f205"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f96e2f3c-c1b9-4412-9382-000f1ad60b02"], "isController": false}, {"data": [0.7844827586206896, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9368421052631579, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f96e2f3c-c1b9-4412-9382-000f1ad60b02"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faee8a49-3547-4373-a2d0-fd32ebd57d9f"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/81cf4044-8063-4ce0-8f56-ef31694133a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c398622-5738-43bb-bb6b-65ff30217a1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c23a5ef-48dc-4e04-b0ea-c5083eed1c98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c10c3c77-2153-4247-bb10-dd3089ca094e"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c4db664-4709-4c23-8e91-0c7fe1a39973"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c4db664-4709-4c23-8e91-0c7fe1a39973"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81cf4044-8063-4ce0-8f56-ef31694133a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec94a6f6-d8ec-4353-bdbd-9b1bbf249058"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c23a5ef-48dc-4e04-b0ea-c5083eed1c98"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/faee8a49-3547-4373-a2d0-fd32ebd57d9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.275, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1374, 27, 1.965065502183406, 298.7416302765647, 77, 3769, 94.0, 855.5, 1083.5, 1510.5, 5.392633991648089, 717.196009545286, 3.9604608857420955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1433.620689655172, 939, 4098, 1344.0, 1774.3, 1945.9999999999998, 4098.0, 0.26124360966601357, 314.36473886899535, 1.2845327877620882], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 241.21052631578948, 160, 473, 178.0, 401.0, 473.0, 473.0, 0.09506511960693075, 0.14733236798456942, 0.21380368208472805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 101.73333333333333, 80, 267, 89.0, 173.40000000000006, 267.0, 267.0, 0.0788884097148447, 0.06124637277666165, 0.0280423643908237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 275.9375, 161, 404, 318.5, 364.1, 404.0, 404.0, 0.0764876854826373, 0.11854097349701698, 0.17202259733057979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04dee71b-5d36-4f8e-a781-40bf5a435829", 3, 0, 0.0, 1280.0, 366, 1861, 1613.0, 1861.0, 1861.0, 1861.0, 0.021539809157290864, 0.025459325211628626, 0.013812963554642907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 85.83333333333333, 79, 91, 88.0, 90.7, 91.0, 91.0, 0.05877742946708464, 0.04368127326606583, 0.02950351440047022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 81.75, 78, 88, 81.0, 88.0, 88.0, 88.0, 0.058781460327412736, 0.015728632939170987, 0.033523801592977576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 84.33333333333333, 77, 89, 86.0, 89.0, 89.0, 89.0, 0.05877915691095937, 0.01584281963615702, 0.03455571529335698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 82.33333333333331, 78, 88, 81.0, 88.0, 88.0, 88.0, 0.058780884456374784, 0.015843285263632267, 0.034614134108587886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 88.0, 80, 93, 91.0, 93.0, 93.0, 93.0, 0.20594494405162353, 0.06073766904647491, 0.12730776326628682], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1014.7586206896555, 618, 3769, 912.5, 1416.7, 1572.3999999999999, 3769.0, 0.2514632560156081, 300.8374769672664, 0.49654170279644483], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 557.6923076923077, 81, 1356, 443.0, 1302.8, 1356.0, 1356.0, 0.0829451923690423, 0.01717224685765329, 0.055460874194474576], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 557.6923076923077, 81, 1356, 443.0, 1302.8, 1356.0, 1356.0, 0.08436956465304639, 0.01746713643207601, 0.05641327336063446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 1079.35, 198, 2040, 1007.0, 1639.8000000000002, 2020.4999999999998, 2040.0, 0.08010092716823197, 0.025125408014097763, 0.03613928549972966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 100.4736842105263, 77, 268, 81.0, 236.0, 268.0, 268.0, 0.09905377577353179, 0.03433484086228918, 0.056053765998488124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 118.33333333333333, 79, 242, 87.0, 242.0, 242.0, 242.0, 0.04676174888940846, 0.012603752630348375, 0.02753645955108721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 84.21052631578947, 78, 91, 83.0, 91.0, 91.0, 91.0, 0.09904706299393207, 0.07360821771326397, 0.04971698279187606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 118.55555555555556, 78, 262, 80.0, 262.0, 262.0, 262.0, 0.04676174888940846, 0.012603752630348375, 0.027490793780687396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 118.42105263157895, 77, 620, 80.0, 233.0, 620.0, 620.0, 0.09905325937356632, 1.5581847480137214, 0.057881193761208656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 164.63157894736844, 79, 839, 89.0, 239.0, 839.0, 839.0, 0.09904912836767037, 4.716059097466949, 0.05778205216761197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 155.13333333333335, 77, 859, 81.0, 497.8000000000002, 859.0, 859.0, 0.07816856268858166, 4.708744953242172, 0.04550672445060529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 132.53333333333336, 79, 683, 82.0, 411.8000000000002, 683.0, 683.0, 0.07816815533575829, 1.5519330496263561, 0.045582823394686646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 84.06666666666666, 77, 91, 82.0, 91.0, 91.0, 91.0, 0.07816693330276138, 0.05809085570644669, 0.039236136442987644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 136.11111111111111, 79, 264, 80.0, 264.0, 264.0, 264.0, 0.046724362601820175, 0.012502417336815164, 0.026647488046350566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 112.73333333333335, 79, 239, 81.0, 237.8, 239.0, 239.0, 0.07816815533575829, 0.028743082118252786, 0.04414261584520621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 104.22222222222223, 80, 246, 89.0, 246.0, 246.0, 246.0, 0.04675591852001933, 0.03474731835325655, 0.023469279413369074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec94a6f6-d8ec-4353-bdbd-9b1bbf249058", 3, 0, 0.0, 428.0, 177, 870, 237.0, 870.0, 870.0, 870.0, 0.017989925641640682, 0.024800564808707126, 0.011536508305349006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 89.88888888888889, 80, 95, 92.0, 95.0, 95.0, 95.0, 0.048998791363146374, 0.03856740804560154, 0.017417539117368437], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 620.7692307692308, 82, 1613, 507.0, 1404.1999999999998, 1613.0, 1613.0, 0.08259894400426973, 0.016579355347010872, 0.056203518238482214], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1355.3157894736842, 999, 2519, 1276.0, 2419.0, 2519.0, 2519.0, 0.08136348064405619, 0.04211195775522439, 0.03742402283530318], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 216.0, 78, 593, 177.0, 479.5, 593.0, 593.0, 0.08549357271533693, 0.19728047426032794, 0.05525236824829776], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fca9f890-d423-4fec-a272-dbc94aa38f9c", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 263.8888888888889, 160, 510, 198.0, 510.0, 510.0, 510.0, 0.04669890620784126, 0.07237418374203525, 0.10502693456704926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60074f5d-5dfc-4103-ac1b-286d0198a874", 3, 0, 0.0, 249.0, 170, 364, 213.0, 364.0, 364.0, 364.0, 0.016747893952335495, 0.02308832385681667, 0.01074002314000681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c10c3c77-2153-4247-bb10-dd3089ca094e", 3, 0, 0.0, 325.0, 177, 418, 380.0, 418.0, 418.0, 418.0, 0.06566850538481744, 0.04221852152832502, 0.042111639195341916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 90.89473684210526, 79, 234, 81.0, 90.0, 234.0, 234.0, 0.09518942695964971, 0.0707413612463803, 0.047780630329355415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 100.63157894736842, 78, 260, 81.0, 237.0, 260.0, 260.0, 0.09510699536979102, 0.02544855149543236, 0.05424070829683394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 543.2, 461, 681, 470.0, 681.0, 681.0, 681.0, 0.08010381454364857, 23.55318117279995, 0.045684206731924575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 883.2, 689, 1015, 927.0, 1015.0, 1015.0, 1015.0, 0.07962290591757437, 71.64483070677272, 0.0453321817870565], "isController": false}, {"data": ["addBook", 66, 9, 13.636363636363637, 871.4242424242423, 419, 1713, 728.0, 1548.1000000000004, 1647.2, 1713.0, 0.3023639362286971, 72.3537786902144, 1.1051736516744548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04dee71b-5d36-4f8e-a781-40bf5a435829", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 211.8, 87, 257, 238.0, 257.0, 257.0, 257.0, 0.0804039494419966, 0.14227730116103304, 0.04452054622423053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a118cccd-caa4-4b64-a721-c010ad6cc122", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 83.87499999999997, 77, 91, 82.0, 91.0, 91.0, 91.0, 0.08578996471887701, 0.0637560187022123, 0.04306254088428006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 122.9375, 77, 267, 80.0, 262.8, 267.0, 267.0, 0.08570908194859599, 0.030979564410375086, 0.04843107181885386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 151.56250000000003, 78, 843, 85.5, 436.3000000000004, 843.0, 843.0, 0.08572239872702238, 4.842483627356696, 0.049934971524090675], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 191.87931034482764, 79, 2762, 89.0, 357.4, 376.8499999999999, 2762.0, 0.2524010740100874, 0.18757540754069968, 0.12201028479979807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a118cccd-caa4-4b64-a721-c010ad6cc122", 3, 0, 0.0, 450.0, 197, 796, 357.0, 796.0, 796.0, 796.0, 0.021272823967381668, 0.02514375775571707, 0.013641752348874313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 145.87500000000003, 78, 464, 88.0, 306.50000000000017, 464.0, 464.0, 0.08579502496099008, 1.5983407878932494, 0.05006106192792145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8008cd7-9cac-447c-be7e-ff75e41a6d38", 2, 0, 0.0, 258.0, 187, 329, 258.0, 329.0, 329.0, 329.0, 0.016826943301614546, 0.028461197068746478, 0.01045932559714615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60074f5d-5dfc-4103-ac1b-286d0198a874", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13ada261-089e-472a-95a2-dbfd39f2f205", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f96e2f3c-c1b9-4412-9382-000f1ad60b02", 3, 0, 0.0, 575.0, 206, 1091, 428.0, 1091.0, 1091.0, 1091.0, 0.022073593360263117, 0.026090240068722455, 0.014155266575429148], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 511.3620689655169, 384, 778, 468.5, 693.2, 704.35, 778.0, 0.25216075683007844, 74.14363503317219, 0.12681913063231484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 84.2, 79, 101, 80.0, 101.0, 101.0, 101.0, 0.08060745780199584, 0.05990456580792854, 0.0452629767931129], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 138.4655172413793, 78, 261, 88.5, 241.0, 242.89999999999995, 261.0, 0.2525868376127931, 0.4469603024945128, 0.12284008313590915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 557.2222222222224, 79, 1091, 735.0, 1085.6, 1091.0, 1091.0, 0.10479495121212827, 52.398487623279614, 0.05660473818728022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 124.47368421052633, 77, 264, 87.0, 239.0, 264.0, 264.0, 0.09519324228183212, 0.025657553583775063, 0.055963214700842714], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 819.8275862068963, 535, 1297, 828.5, 1086.8, 1129.75, 1297.0, 0.2519077670113749, 226.66705156345688, 0.12644589086313157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 90.37500000000001, 81, 116, 90.0, 110.4, 116.0, 116.0, 0.0766342248448157, 0.057251154303011725, 0.02724107211280558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 379.94444444444446, 79, 776, 468.5, 704.9000000000001, 776.0, 776.0, 0.10478946050892747, 17.130097752557155, 0.056704105854820025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 103.3684210526316, 77, 321, 82.0, 236.0, 321.0, 321.0, 0.09519419616016674, 0.02565781068379494, 0.056056738559160685], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 434.53846153846155, 80, 773, 435.0, 772.6, 773.0, 773.0, 0.08454899614326503, 0.017504284357785335, 0.056901626836501754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 190, 9, 4.7368421052631575, 159.82631578947365, 80, 1219, 92.0, 308.5, 394.39999999999986, 1159.8500000000001, 0.7862285856161549, 1.5573193613961764, 0.38179528443888106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 105.83333333333334, 82, 269, 91.0, 217.7000000000002, 269.0, 269.0, 0.05934688750302916, 0.0459590642479513, 0.021095963917092397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 280.62500000000006, 166, 933, 180.0, 524.9000000000004, 933.0, 933.0, 0.08566732166473023, 6.529963358814899, 0.19129789004063844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 104.78947368421052, 80, 274, 87.0, 249.0, 274.0, 274.0, 0.09935471725739148, 0.0806286816805589, 0.03531749715008837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f96e2f3c-c1b9-4412-9382-000f1ad60b02", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faee8a49-3547-4373-a2d0-fd32ebd57d9f", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 689.1052631578948, 104, 2029, 604.0, 1548.0, 2029.0, 2029.0, 0.08097096977652012, 0.04973705077092887, 0.0366108974673133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81cf4044-8063-4ce0-8f56-ef31694133a8", 3, 0, 0.0, 587.3333333333334, 263, 906, 593.0, 906.0, 906.0, 906.0, 0.02258253918070548, 0.026691796798548696, 0.014481641336585218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 82.72222222222223, 79, 90, 82.0, 89.1, 90.0, 90.0, 0.10479251082855945, 0.07787802806692748, 0.052600928286991755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c398622-5738-43bb-bb6b-65ff30217a1d", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 144.7777777777778, 77, 275, 85.5, 265.1, 275.0, 275.0, 0.10479556132578029, 0.11548434470753305, 0.05487666872376472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c23a5ef-48dc-4e04-b0ea-c5083eed1c98", 3, 0, 0.0, 406.66666666666663, 175, 807, 238.0, 807.0, 807.0, 807.0, 0.033220384027639355, 0.027694467283458465, 0.021303436371891128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c10c3c77-2153-4247-bb10-dd3089ca094e", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["login", 19, 0, 0.0, 2591.1052631578946, 1514, 3892, 2483.0, 3731.0, 3892.0, 3892.0, 0.0843046860094155, 26.656759537244923, 0.16398596021928094], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 172.91666666666669, 166, 179, 173.5, 178.7, 179.0, 179.0, 0.05875268059105197, 0.0910551797832026, 0.1321361556652272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 100.47368421052632, 81, 268, 92.0, 105.0, 268.0, 268.0, 0.097505901672996, 0.07893788328800164, 0.034660300985322794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 283.4666666666667, 161, 946, 180.0, 586.6000000000003, 946.0, 946.0, 0.07813435984518978, 6.344744015559155, 0.174393246000823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c4db664-4709-4c23-8e91-0c7fe1a39973", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c4db664-4709-4c23-8e91-0c7fe1a39973", 3, 0, 0.0, 281.3333333333333, 165, 482, 197.0, 482.0, 482.0, 482.0, 0.02266203353980964, 0.02678575643979453, 0.014532619164526365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81cf4044-8063-4ce0-8f56-ef31694133a8", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec94a6f6-d8ec-4353-bdbd-9b1bbf249058", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 110.43749999999999, 80, 267, 90.0, 247.40000000000003, 267.0, 267.0, 0.0813690339969995, 0.06746319322602792, 0.028924148803620923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c23a5ef-48dc-4e04-b0ea-c5083eed1c98", 1, 0, 0.0, 773.0, 773, 773, 773.0, 773.0, 773.0, 773.0, 1.29366106080207, 0.23371806274256143, 0.8919186610608021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 642.8888888888889, 160, 1182, 817.0, 1171.2, 1182.0, 1182.0, 0.10473824167767389, 69.68511611397848, 0.220670837527712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faee8a49-3547-4373-a2d0-fd32ebd57d9f", 3, 0, 0.0, 333.0, 217, 507, 275.0, 507.0, 507.0, 507.0, 0.028938534552610255, 0.029023315415557353, 0.018557588889531965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 103.83333333333331, 81, 244, 84.0, 242.2, 244.0, 244.0, 0.10461102135227181, 0.08121656442876571, 0.03718594899631537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 268.0, 158, 917, 180.0, 359.0, 917.0, 917.0, 0.09900164655370057, 6.37906240555764, 0.22132383927082683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 486.1818181818182, 78, 1117, 88.0, 1097.4, 1117.0, 1117.0, 0.1225940909648155, 66.68387163284184, 0.16995998974667603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 82.125, 78, 98, 80.5, 92.4, 98.0, 98.0, 0.07651731443355667, 0.056864918246031855, 0.03840810509653137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 145.18749999999997, 78, 313, 83.5, 275.20000000000005, 313.0, 313.0, 0.07651768036651968, 0.02047445744182265, 0.04363898958403076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 155.31249999999997, 77, 264, 90.0, 261.2, 264.0, 264.0, 0.07651804630298277, 0.020624004667600823, 0.04498424206483948], "isController": false}, {"data": ["register", 20, 6, 30.0, 1079.35, 198, 2040, 1007.0, 1639.8000000000002, 2020.4999999999998, 2040.0, 0.08187493603520622, 0.0256818647016682, 0.03693966840650906], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 152.06249999999997, 77, 262, 92.0, 253.60000000000002, 262.0, 262.0, 0.07651768036651968, 0.020623906036288508, 0.04505875123145642], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.4366812227074236], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2183406113537118], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.2183406113537118], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.091703056768559], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1374, 27, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 190, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
